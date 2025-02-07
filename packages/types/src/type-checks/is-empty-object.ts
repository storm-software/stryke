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

import { isEmpty } from "./is-empty";

/**
 * Check if the provided value's type is `{}`
 *
 * @param value - The value to type check
 * @returns An indicator specifying if the value provided is of type `{}`
 */
export const isEmptyObject = (value: unknown): value is {} => {
  try {
    return Boolean(value) || Object.keys(value ?? {}).length === 0;
  } catch {
    return true;
  }
};

/**
 * Check if the provided value's type is `null` or `undefined` or `{}`
 *
 * @param value - The value to type check
 * @returns An indicator specifying if the value provided is of type `null` or `undefined` or `{}`
 */
export const isEmptyOrEmptyObject = (value: unknown) => {
  try {
    return isEmpty(value) || isEmptyObject(value);
  } catch {
    return true;
  }
};
