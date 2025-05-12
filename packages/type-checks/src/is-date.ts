/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/projects/stryke/license.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://stormsoftware.com/projects/stryke/docs
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import { getObjectTag } from "./get-object-tag";
import { isObjectLike } from "./is-plain-object";

/**
 * Checks if `value` is classified as a `Date` object.
 *
 * @example
 * ```typescript
 * isDate(new Date)
 * // => true
 *
 * isDate('Mon April 23 2012')
 * // => false
 * ```
 *
 * @param value - The value to check.
 * @returns Returns `true` if `obj` is a date object, else `false`.
 */
export const isDate = (value: unknown): value is Date =>
  isObjectLike(value) && getObjectTag(value) == "[object Date]";
