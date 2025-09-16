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
import { Buffer } from "node:buffer";
import { once } from "node:events";
import type {
  AgentOptions,
  ClientRequest,
  OutgoingHttpHeaders
} from "node:http";
import * as net from "node:net";
import * as tls from "node:tls";
import { URL } from "node:url";
import { Agent } from "./agent";

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

export type HttpProxyAgentOptions<T> = ConnectOpts<T> &
  AgentOptions & {
    headers?: OutgoingHttpHeaders | (() => OutgoingHttpHeaders);
  };

interface HttpProxyAgentClientRequest extends ClientRequest {
  outputData?: {
    data: string;
  }[];
  _header?: string | null;
  _implicitHeader: () => void;
}

/**
 * The `HttpProxyAgent` implements an HTTP Agent subclass that connects
 * to the specified "HTTP proxy server" in order to proxy HTTP requests.
 */
export class HttpProxyAgent<Uri extends string> extends Agent {
  static protocols = ["http", "https"] as const;

  readonly proxy: URL;

  proxyHeaders: OutgoingHttpHeaders | (() => OutgoingHttpHeaders);

  connectOpts: net.TcpNetConnectOpts & tls.ConnectionOptions;

  constructor(proxy: Uri | URL, opts?: HttpProxyAgentOptions<Uri>) {
    super(opts);
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
      ...(opts ? omit(opts, "headers") : null),
      host,
      port
    };
  }

  addRequest(req: HttpProxyAgentClientRequest, opts: AgentConnectOpts): void {
    req._header = null;
    this.setRequestProps(req, opts);

    // @ts-expect-error `addRequest()` isn't defined in `@types/node`
    // eslint-disable-next-line ts/no-unsafe-call
    super.addRequest(req, opts);
  }

  setRequestProps(
    req: HttpProxyAgentClientRequest,
    opts: AgentConnectOpts
  ): void {
    const { proxy } = this;
    const protocol = opts.secureEndpoint ? "https:" : "http:";
    const hostname = req.getHeader("host") || "localhost";
    const base = `${protocol}//${Array.isArray(hostname) ? hostname.join("") : hostname}`;
    const url = new URL(req.path, base);
    if (opts.port !== 80) {
      url.port = String(opts.port);
    }

    // Change the `http.ClientRequest` instance's "path" field
    // to the absolute path of the URL that will be requested.
    req.path = String(url);

    // Inject the `Proxy-Authorization` header if necessary.

    const headers: OutgoingHttpHeaders =
      typeof this.proxyHeaders === "function"
        ? this.proxyHeaders()
        : { ...this.proxyHeaders };
    if (proxy.username || proxy.password) {
      const auth = `${decodeURIComponent(
        proxy.username
      )}:${decodeURIComponent(proxy.password)}`;
      headers["Proxy-Authorization"] = `Basic ${Buffer.from(auth).toString(
        "base64"
      )}`;
    }

    if (!headers["Proxy-Connection"]) {
      headers["Proxy-Connection"] = this.keepAlive ? "Keep-Alive" : "close";
    }
    for (const name of Object.keys(headers)) {
      const value = headers[name];
      if (value) {
        req.setHeader(name, value);
      }
    }
  }

  async connect(
    req: HttpProxyAgentClientRequest,
    opts: AgentConnectOpts
  ): Promise<net.Socket> {
    req._header = null;

    if (!req.path.includes("://")) {
      this.setRequestProps(req, opts);
    }

    // At this point, the http ClientRequest's internal `_header` field
    // might have already been set. If this is the case then we'll need
    // to re-generate the string since we just changed the `req.path`.
    let first: string;
    let endOfHeaders: number;

    req._implicitHeader();
    if (req.outputData && req.outputData.length > 0) {
      first = req.outputData[0]!.data;
      endOfHeaders = first.indexOf("\r\n\r\n") + 4;
      req.outputData[0]!.data = req._header + first.substring(endOfHeaders);
    }

    // Create a socket connection to the proxy server.
    let socket: net.Socket;
    if (this.proxy.protocol === "https:") {
      socket = tls.connect(this.connectOpts);
    } else {
      socket = net.connect(this.connectOpts);
    }

    // Wait for the socket's `connect` event, so that this `callback()`
    // function throws instead of the `http` request machinery. This is
    // important for i.e. `PacProxyAgent` which determines a failed proxy
    // connection via the `callback()` function throwing.
    await once(socket, "connect");

    return socket;
  }
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
