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

import { isSet } from "./is-set";
import { isString } from "./is-string";

/**
 * Determine if the type is string and is not empty (length greater than zero)
 *
 * @param value - The value to type check
 * @returns An indicator specifying if the value provided is of type `string` and length greater than zero
 */
export const isSetString = (value: unknown): value is NonNullable<string> => {
  try {
    return isSet(value) && isString(value) && value.length > 0;
  } catch {
    return false;
  }
};
