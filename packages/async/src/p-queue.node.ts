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

import os from "node:os";
import type { Options, PriorityQueue, QueueAddOptions } from "p-queue";
import BasePQueue from "p-queue";

/**
 * A wrapper around the `p-queue` library that provides a convenient interface for managing asynchronous tasks with concurrency control. This class extends the functionality of `p-queue` and sets a default concurrency based on the number of CPU cores available.
 *
 * @see https://github.com/sindresorhus/p-queue
 *
 * @example
 * ```ts
 * import { PQueue } from "@stryke/async/node";
 *
 * const queue = new PQueue();
 *
 * queue.add(async () => {
 *   // Task 1
 * });
 *
 * queue.add(async () => {
 *   // Task 2
 * });
 *
 * queue.add(async () => {
 *   // Task 3
 * });
 * ```
 */
export class PQueue extends BasePQueue {
  constructor(options: Options<PriorityQueue, QueueAddOptions> = {}) {
    super({
      concurrency: os.cpus().length,
      ...options
    });
  }
}
