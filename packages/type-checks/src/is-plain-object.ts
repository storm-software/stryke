/* -------------------------------------------------------------------

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

 ------------------------------------------------------------------- */

import type { PlainObject } from "@stryke/types/base";
import { getObjectTag } from "./get-object-tag";

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @example
 * ```typescript
 * isObjectLike({})
 * // => true
 *
 * isObjectLike([1, 2, 3])
 * // => true
 *
 * isObjectLike(Function)
 * // => false
 *
 * isObjectLike(null)
 * // => false
 * ```
 *
 * @param value - The value to check.
 * @returns Returns `true` if `value` is object-like, else `false`.
 */
export const isObjectLike = (obj: unknown) => {
  return typeof obj === "object" && obj !== null;
};

/**
 * Checks if `obj` is a plain object, that is, an object created by the `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @example
 * ```typescript
 * function Foo() {
 *   this.a = 1
 * }
 *
 * isPlainObject(new Foo)
 * // => false
 *
 * isPlainObject([1, 2, 3])
 * // => false
 *
 * isPlainObject({ 'x': 0, 'y': 0 })
 * // => true
 *
 * isPlainObject(Object.create(null))
 * // => true
 * ```
 *
 * @param obj - The value to check.
 * @returns Returns `true` if `obj` is a plain object, else `false`.
 */
export const isPlainObject = (obj: unknown): obj is PlainObject => {
  if (!isObjectLike(obj) || getObjectTag(obj) !== "[object Object]") {
    return false;
  }
  if (Object.getPrototypeOf(obj) === null) {
    return true;
  }
  let proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(obj) === proto;
};
