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

import { getObjectTag } from "./get-object-tag";

/**
 * Checks if `value` is classified as a `bigint` object.
 *
 * @example
 * ```typescript
 * isDate(37n)
 * // => true
 *
 * isBigInt(37)
 * // => false
 * ```
 *
 * @param value - The obj to check.
 * @returns Returns `true` if `value` is a bigint object, else `false`.
 */
export const isBigInt = (value: unknown): value is bigint =>
  typeof value === "bigint" || getObjectTag(value) == "[object BigInt]";
