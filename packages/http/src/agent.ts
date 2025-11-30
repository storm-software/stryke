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

import { isBoolean, isString } from "@stryke/type-checks";
import * as http from "node:http";
import type { Agent as HttpsAgent } from "node:https";
import * as net from "node:net";
import type { Duplex } from "node:stream";
import type * as tls from "node:tls";

interface HttpConnectOpts extends net.TcpNetConnectOpts {
  secureEndpoint: false;
  protocol?: string;
}

interface HttpsConnectOpts extends tls.ConnectionOptions {
  secureEndpoint: true;
  protocol?: string;
  port: number;
}

export type AgentConnectOpts = HttpConnectOpts | HttpsConnectOpts;

const SYMBOL_INTERNAL = Symbol("AgentBaseInternalState");

interface InternalState {
  defaultPort?: number;
  protocol?: string;
  currentSocket?: Duplex;
}

export abstract class Agent extends http.Agent {
  private [SYMBOL_INTERNAL]: InternalState;

  // Set by `http.Agent` - missing from `@types/node`
  options!: Partial<net.TcpNetConnectOpts & tls.ConnectionOptions>;

  keepAlive!: boolean;

  constructor(opts?: http.AgentOptions) {
    super(opts);
    this[SYMBOL_INTERNAL] = {};
  }

  abstract connect(
    req: http.ClientRequest,
    options: AgentConnectOpts
  ): Promise<Duplex | http.Agent> | Duplex | http.Agent;

  /**
   * Determine whether this is an `http` or `https` request.
   */
  isSecureEndpoint(options?: AgentConnectOpts): boolean {
    if (options) {
      // First check the `secureEndpoint` property explicitly, since this
      // means that a parent `Agent` is "passing through" to this instance.
      if (isBoolean((options as any).secureEndpoint)) {
        return options.secureEndpoint;
      }

      // If no explicit `secure` endpoint, check if `protocol` property is
      // set. This will usually be the case since using a full string URL
      // or `URL` instance should be the most common usage.
      if (isString(options.protocol)) {
        return options.protocol === "https:";
      }
    }

    // Finally, if no `protocol` property was set, then fall back to
    // checking the stack trace of the current call stack, and try to
    // detect the "https" module.
    const { stack } = new Error(" ");
    if (!isString(stack)) {
      return false;
    }

    return stack
      .split("\n")
      .some(l => l.includes("(https.js:") || l.includes("node:https:"));
  }

  // In order to support async signatures in `connect()` and Node's native
  // connection pooling in `http.Agent`, the array of sockets for each origin
  // has to be updated synchronously. This is so the length of the array is
  // accurate when `addRequest()` is next called. We achieve this by creating a
  // fake socket and adding it to `sockets[origin]` and incrementing
  // `totalSocketCount`.
  private incrementSockets(name: string) {
    // If `maxSockets` and `maxTotalSockets` are both Infinity then there is no
    // need to create a fake socket because Node.js native connection pooling
    // will never be invoked.
    if (this.maxSockets === Infinity && this.maxTotalSockets === Infinity) {
      return null;
    }
    // All instances of `sockets` are expected TypeScript errors. The
    // alternative is to add it as a private property of this class but that
    // will break TypeScript sub-classing.

    // @ts-expect-error `sockets` is readonly in `@types/node`
    this.sockets[name] ??= [];

    const fakeSocket = new net.Socket({ writable: false });
    this.sockets[name].push(fakeSocket);
    // @ts-expect-error `totalSocketCount` isn't defined in `@types/node`
    this.totalSocketCount++;
    return fakeSocket;
  }

  private decrementSockets(name: string, socket: null | net.Socket) {
    if (!this.sockets[name] || socket === null) {
      return;
    }
    const sockets = this.sockets[name];
    const index = sockets.indexOf(socket);
    if (index !== -1) {
      sockets.splice(index, 1);
      // @ts-expect-error  `totalSocketCount` isn't defined in `@types/node`
      this.totalSocketCount--;
      if (sockets.length === 0) {
        // @ts-expect-error `sockets` is readonly in `@types/node`
        delete this.sockets[name];
      }
    }
  }

  // In order to properly update the socket pool, we need to call `getName()` on
  // the core `https.Agent` if it is a secureEndpoint.
  override getName(options?: AgentConnectOpts): string {
    const secureEndpoint = this.isSecureEndpoint(options);
    if (secureEndpoint) {
      // @ts-expect-error `getName()` isn't defined in `@types/node`
      return HttpsAgent.prototype.getName.call(this, options);
    }

    return super.getName(options);
  }

  createSocket(
    req: http.ClientRequest,
    options: AgentConnectOpts,
    cb: (err: Error | null, s?: Duplex) => void
  ) {
    const connectOpts = {
      ...options,
      secureEndpoint: this.isSecureEndpoint(options)
    };
    const name = this.getName(connectOpts);
    const fakeSocket = this.incrementSockets(name);
    Promise.resolve()
      .then(async () => this.connect(req, connectOpts))
      .then(
        socket => {
          this.decrementSockets(name, fakeSocket);
          if (socket instanceof http.Agent) {
            try {
              // @ts-expect-error `addRequest()` isn't defined in `@types/node`
              // eslint-disable-next-line ts/no-unsafe-call
              return socket.addRequest(req, connectOpts);
            } catch (err: unknown) {
              return cb(err as Error);
            }
          }
          this[SYMBOL_INTERNAL].currentSocket = socket;
          // @ts-expect-error `createSocket()` isn't defined in `@types/node`
          // eslint-disable-next-line ts/no-unsafe-call
          super.createSocket(req, options, cb);
        },
        err => {
          this.decrementSockets(name, fakeSocket);
          cb(err);
        }
      );
  }

  override createConnection(): Duplex {
    const socket = this[SYMBOL_INTERNAL].currentSocket;
    this[SYMBOL_INTERNAL].currentSocket = undefined;
    if (!socket) {
      throw new Error("No socket was returned in the `connect()` function");
    }
    return socket;
  }

  get defaultPort(): number {
    return (
      this[SYMBOL_INTERNAL].defaultPort ??
      (this.protocol === "https:" ? 443 : 80)
    );
  }

  set defaultPort(v: number) {
    if (this[SYMBOL_INTERNAL]) {
      this[SYMBOL_INTERNAL].defaultPort = v;
    }
  }

  get protocol(): string {
    return (
      this[SYMBOL_INTERNAL].protocol ??
      (this.isSecureEndpoint() ? "https:" : "http:")
    );
  }

  set protocol(v: string) {
    if (this[SYMBOL_INTERNAL]) {
      this[SYMBOL_INTERNAL].protocol = v;
    }
  }
}
