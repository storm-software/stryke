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
  // eslint-disable-next-line eqeqeq
  typeof value === "bigint" || getObjectTag(value) == "[object BigInt]";
