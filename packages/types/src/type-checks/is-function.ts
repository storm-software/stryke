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

import { AnyFunction } from "../utility-types/base";
import { getObjectTag } from "./get-object-tag";

export function isSyncFunction(value?: any): value is AnyFunction {
  return getObjectTag(value) === "[object Function]";
}

export function isAsyncFunction(value?: any): value is AnyFunction {
  return getObjectTag(value) === "[object AsyncFunction]";
}

/**
 * Check if the provided value's type is `Function`
 *
 * @param value - The value to type check
 * @returns An indicator specifying if the value provided is of type `Function`
 */
export const isFunction = (value: unknown): value is AnyFunction => {
  try {
    return (
      value instanceof Function ||
      typeof value === "function" ||
      Boolean(
        value?.constructor && (value as any)?.call && (value as any)?.apply
      ) ||
      isSyncFunction(value) ||
      isAsyncFunction(value)
    );
  } catch {
    return false;
  }
};
