/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/license.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://docs.stormsoftware.com/projects/stryke
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import { isNonNullObject } from "./is-non-null-object";

/**
 * Check if the provided value's type is an object with some fields set
 *
 * @param value - The value to type check
 * @returns An indicator specifying if the value provided is an object with some fields se
 */
export const isSetObject = (value: unknown): value is NonNullable<object> => {
  try {
    return isNonNullObject(value) && Object.keys(value).length > 0;
  } catch {
    return false;
  }
};
