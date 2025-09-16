/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/licenses/projects/stryke.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://docs.stormsoftware.com/projects/stryke
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import type { AgentConnectOpts } from "agent-base";
import { Agent } from "agent-base";
import assert from "node:assert";
import { Buffer } from "node:buffer";
import type * as http from "node:http";
import type { OutgoingHttpHeaders } from "node:http";
import * as net from "node:net";
import * as tls from "node:tls";
import { URL } from "node:url";
import { parseProxyResponse } from "./parse-response";

const setServernameFromNonIpHost = <
  T extends { host?: string; servername?: string }
>(
  options: T
) => {
  if (
    options.servername === undefined &&
    options.host &&
    !net.isIP(options.host)
  ) {
    return {
      ...options,
      servername: options.host
    };
  }
  return options;
};

type Protocol<T> = T extends `${infer Protocol}:${infer _}` ? Protocol : never;

interface ConnectOptsMap {
  http: Omit<net.TcpNetConnectOpts, "host" | "port">;
  https: Omit<tls.ConnectionOptions, "host" | "port">;
}

type ConnectOpts<T> = {
  [P in keyof ConnectOptsMap]: Protocol<T> extends P
    ? ConnectOptsMap[P]
    : never;
}[keyof ConnectOptsMap];

export type HttpsProxyAgentOptions<T> = ConnectOpts<T> &
  http.AgentOptions & {
    headers?: OutgoingHttpHeaders | (() => OutgoingHttpHeaders);
  };

/**
 * The `HttpsProxyAgent` implements an HTTP Agent subclass that connects to
 * the specified "HTTP(s) proxy server" in order to proxy HTTPS requests.
 *
 * Outgoing HTTP requests are first tunneled through the proxy server using the
 * `CONNECT` HTTP request method to establish a connection to the proxy server,
 * and then the proxy server connects to the destination target and issues the
 * HTTP request from the proxy server.
 *
 * `https:` requests have their socket connection upgraded to TLS once
 * the connection to the proxy server has been established.
 */
export class HttpsProxyAgent<Uri extends string> extends Agent {
  static protocols = ["http", "https"] as const;

  readonly proxy: URL;

  proxyHeaders: OutgoingHttpHeaders | (() => OutgoingHttpHeaders);

  connectOpts: net.TcpNetConnectOpts & tls.ConnectionOptions;

  constructor(proxy: Uri | URL, opts?: HttpsProxyAgentOptions<Uri>) {
    super(opts);
    this.options = { path: undefined };
    this.proxy = typeof proxy === "string" ? new URL(proxy) : proxy;
    this.proxyHeaders = opts?.headers ?? {};

    // Trim off the brackets from IPv6 addresses
    const host = (this.proxy.hostname || this.proxy.host).replace(
      /^\[|\]$/g,
      ""
    );
    const port = this.proxy.port
      ? Number.parseInt(this.proxy.port, 10)
      : this.proxy.protocol === "https:"
        ? 443
        : 80;
    this.connectOpts = {
      // Attempt to negotiate http/1.1 for proxy servers that support http/2
      ALPNProtocols: ["http/1.1"],
      ...(opts ? omit(opts, "headers") : null),
      host,
      port
    };
  }

  /**
   * Called when the node-core HTTP client library is creating a
   * new HTTP request.
   */
  async connect(
    req: http.ClientRequest,
    opts: AgentConnectOpts
  ): Promise<net.Socket> {
    const { proxy } = this;

    if (!opts.host) {
      throw new TypeError('No "host" provided');
    }

    // Create a socket connection to the proxy server.
    let socket: net.Socket;
    if (proxy.protocol === "https:") {
      socket = tls.connect(setServernameFromNonIpHost(this.connectOpts));
    } else {
      socket = net.connect(this.connectOpts);
    }

    const headers: OutgoingHttpHeaders =
      typeof this.proxyHeaders === "function"
        ? this.proxyHeaders()
        : { ...this.proxyHeaders };
    const host = net.isIPv6(opts.host) ? `[${opts.host}]` : opts.host;
    let payload = `CONNECT ${host}:${opts.port} HTTP/1.1\r\n`;

    // Inject the `Proxy-Authorization` header if necessary.
    if (proxy.username || proxy.password) {
      const auth = `${decodeURIComponent(
        proxy.username
      )}:${decodeURIComponent(proxy.password)}`;
      headers["Proxy-Authorization"] = `Basic ${Buffer.from(auth).toString(
        "base64"
      )}`;
    }

    headers.Host = `${host}:${opts.port}`;

    if (!headers["Proxy-Connection"]) {
      headers["Proxy-Connection"] = this.keepAlive ? "Keep-Alive" : "close";
    }
    for (const name of Object.keys(headers)) {
      payload += `${name}: ${headers[name]?.toString()}\r\n`;
    }

    const proxyResponsePromise = parseProxyResponse(socket);

    socket.write(`${payload}\r\n`);

    const { connect, buffered } = await proxyResponsePromise;
    req.emit("proxyConnect", connect);
    this.emit("proxyConnect", connect, req);

    if (connect.statusCode === 200) {
      req.once("socket", resume);

      if (opts.secureEndpoint) {
        // The proxy is connecting to a TLS server, so upgrade
        // this socket connection to a TLS connection.
        return tls.connect({
          ...omit(setServernameFromNonIpHost(opts), "host", "path", "port"),
          socket
        });
      }

      return socket;
    }

    // Some other status code that's not 200... need to re-play the HTTP
    // header "data" events onto the socket once the HTTP machinery is
    // attached so that the node core `http` can parse and handle the
    // error status code.

    // Close the original socket, and a new "fake" socket is returned
    // instead, so that the proxy doesn't get the HTTP request
    // written to it (which may contain `Authorization` headers or other
    // sensitive data).
    //
    // See: https://hackerone.com/reports/541502
    socket.destroy();

    const fakeSocket = new net.Socket({ writable: false });
    fakeSocket.readable = true;

    // Need to wait for the "socket" event to re-play the "data" events.
    req.once("socket", (s: net.Socket) => {
      assert(s.listenerCount("data") > 0);

      // Replay the "buffered" Buffer onto the fake `socket`, since at
      // this point the HTTP module machinery has been hooked up for
      // the user.
      s.push(buffered);
      s.push(null);
    });

    return fakeSocket;
  }
}

function resume(socket: net.Socket | tls.TLSSocket): void {
  socket.resume();
}

function omit<T extends object, K extends [...(keyof T)[]]>(
  obj: T,
  ...keys: K
): {
  [K2 in Exclude<keyof T, K[number]>]: T[K2];
} {
  const ret = {} as {
    [K in keyof typeof obj]: (typeof obj)[K];
  };
  let key: keyof typeof obj;
  for (key in obj) {
    if (!keys.includes(key)) {
      ret[key] = obj[key];
    }
  }
  return ret;
}
