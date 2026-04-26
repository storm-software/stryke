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

import { delay } from "./delay";
import { TimeoutError } from "./errors";

/**
 * Returns a promise that rejects with a `TimeoutError` after a specified delay.
 *
 * @param ms - The delay duration in milliseconds.
 * @returns A promise that rejects with a `TimeoutError` after the specified delay.
 * @throws Throws a `TimeoutError` after the specified delay.
 */
export async function timeout(ms: number): Promise<never> {
  await delay(ms);
  throw new TimeoutError();
}
