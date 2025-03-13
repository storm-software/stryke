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
import { isEmptyObject } from "./is-empty-object";
import { isEmptyString } from "./is-empty-string";

/**
 * The inverse of the `isEmptyObject` function
 *
 * @param value - The value to type check
 * @returns An indicator specifying if the value provided is **NOT** of type `null` or `undefined` or `{}`
 */
export const isNotEmpty = (value: unknown): value is NonNullable<unknown> => {
  try {
    return !isEmpty(value) && !isEmptyString(value) && !isEmptyObject(value);
  } catch {
    return false;
  }
};
