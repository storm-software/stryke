/*-------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 License, and is
 free for commercial and private use. For more information, please visit
 our licensing page.

 Website:         https://stormsoftware.com
 Repository:      https://github.com/storm-software/stryke
 Documentation:   https://stormsoftware.com/projects/stryke/docs
 Contact:         https://stormsoftware.com/contact
 License:         https://stormsoftware.com/projects/stryke/license

 -------------------------------------------------------------------*/

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
