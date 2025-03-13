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
import { isObjectLike } from "./is-plain-object";

/**
 * Checks if `value` is classified as a `isRegExp` object.
 *
 * @example
 * ```typescript
 * isRegExp(new Date)
 * // => true
 *
 * isRegExp('Mon April 23 2012')
 * // => false
 * ```
 *
 * @param value - The value to check.
 * @returns Returns `true` if `obj` is a isRegExp object, else `false`.
 */
export const isRegExp = (value: unknown): value is RegExp =>
  isObjectLike(value) && getObjectTag(value) === "[object RegExp]";
