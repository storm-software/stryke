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

import { isNull } from "./is-null";
import { isObject } from "./is-object";

/**
 * Check if the provided value's type is `AsyncIterable`
 *
 * @param value - The value to type check
 * @returns An indicator specifying if the object provided is `AsyncIterable`
 */
export const isAsyncIterable = (
  value: unknown
): value is AsyncIterable<unknown> => {
  return isObject(value) && !isNull(value) && Symbol.asyncIterator in value;
};
