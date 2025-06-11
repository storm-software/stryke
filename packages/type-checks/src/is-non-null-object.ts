/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/projects/stryke/license.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://docs.stormsoftware.com/projects/stryke
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import { isObject } from "./is-object";
import { isSet } from "./is-set";

/**
 * Check if the provided value's type is `Object` and is not `null` or `undefined`
 *
 * @param value - The value to type check
 * @returns An indicator specifying if the value provided is of type `Object` and is not `null` or `undefined`
 */
export const isNonNullObject = (value: any): value is NonNullable<object> => {
  return isSet(value) && isObject(value);
};
