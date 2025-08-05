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

import { Conn, Deferred, DeferredTransport, Message } from "capnp-es";
import type { Message as RPCMessage } from "capnp-es/capnp/rpc";
import type { MessagePort } from "node:worker_threads";
import { MessageChannel } from "node:worker_threads";

export class MessageChannelTransport extends DeferredTransport {
  constructor(public port: MessagePort) {
    super();
    this.port.on("message", this.resolve);
    this.port.on("messageerror", this.reject);
    this.port.on("close", this.close);
  }

  public override close = (): void => {
    this.port.off("message", this.resolve);
    this.port.off("messageerror", this.reject);
    this.port.off("close", this.close);
    this.port.close();
    super.close();
  };

  public sendMessage(msg: RPCMessage): void {
    const m = new Message();
    m.setRoot(msg);

    const buf = m.toArrayBuffer();
    this.port.postMessage(buf, [buf]);
  }
}

/**
 * A class that manages Cap'n Proto RPC connections.
 */
export class CapnpRPC {
  /**
   * A queue for deferred connections that are waiting to be accepted.
   *
   * @remarks
   * This is used to manage incoming connections when the accept method is called.
   */
  protected acceptQueue = new Array<Deferred<Conn>>();

  /**
   * A map of connections by their ID.
   *
   * @remarks
   * This is used to manage multiple connections and allows for easy retrieval by ID.
   */
  protected connections: Record<number, Conn> = {};

  /**
   * A queue for connections that are waiting to be accepted.
   *
   * @remarks
   * This is used to manage incoming connections when the accept method is called.
   */
  protected connectQueue = new Array<MessagePort>();

  /**
   * Creates a new {@link Conn} instance.
   *
   * @remarks
   * This class is used to manage connections and accept incoming connections using the {@link MessageChannel} API.
   */
  public connect(id = 0): Conn {
    if (this.connections[id] !== undefined) {
      return this.connections[id];
    }

    const ch = new MessageChannel();
    const conn = new Conn(new MessageChannelTransport(ch.port1));
    const accept = this.acceptQueue.pop();
    this.connections[id] = conn;

    if (accept === undefined) {
      this.connectQueue.push(ch.port2);
    } else {
      accept.resolve(new Conn(new MessageChannelTransport(ch.port2)));
    }

    return conn;
  }

  /**
   * Accepts a connection from the connect queue.
   *
   * @returns A promise that resolves to a Conn instance when a connection is accepted.
   * @throws If no connections are available in the connect queue.
   */
  public async accept(): Promise<Conn> {
    const port2 = this.connectQueue.pop();
    if (port2 !== undefined) {
      return Promise.resolve(new Conn(new MessageChannelTransport(port2)));
    }

    const deferred = new Deferred<Conn>();
    this.acceptQueue.push(deferred);
    return deferred.promise;
  }

  /**
   * Closes all connections and clears the queues.
   *
   * @remarks
   * This method will reject all pending accept promises and close all
   * connections in the connect queue.
   */
  public close(): void {
    let i = this.acceptQueue.length;
    while (--i >= 0) {
      this.acceptQueue[i]?.reject();
    }

    i = this.connectQueue.length;
    while (--i >= 0) {
      this.connectQueue[i]!.close();
    }

    for (const id in this.connections) {
      this.connections[id]?.shutdown();
    }

    this.acceptQueue.length = 0;
    this.connectQueue.length = 0;
    this.connections = {};
  }
}
