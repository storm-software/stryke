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

import { EMPTY_STRING } from "@stryke/types/base";
import { isString } from "./is-string";

/**
 * Determine if the type is string and is empty
 *
 * @param value - The value to type check
 * @returns An indicator specifying if the value provided is of type `""`
 */
export const isEmptyString = (value: unknown): value is string => {
  try {
    return isString(value) && value === EMPTY_STRING;
  } catch {
    return false;
  }
};
