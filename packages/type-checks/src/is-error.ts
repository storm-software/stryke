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
import { isObject } from "./is-object";
import { isPlainObject } from "./is-plain-object";

/**
 * Checks if `obj` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
 * `SyntaxError`, `TypeError`, or `URIError` object.
 *
 * @example
 * ```typescript
 * isError(new Error)
 * // => true
 *
 * isError(Error)
 * // => false
 * ```
 *
 * @param obj - The obj to check.
 * @returns Returns `true` if `obj` is an error object, else `false`.
 */
export const isError = (obj: unknown): obj is Error => {
  if (!isObject(obj)) {
    return false;
  }

  const tag = getObjectTag(obj);

  return (
    tag === "[object Error]" ||
    tag === "[object DOMException]" ||
    (typeof (obj as Error)?.message === "string" &&
      typeof (obj as Error)?.name === "string" &&
      !isPlainObject(obj))
  );
};
