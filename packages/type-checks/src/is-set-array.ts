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

import { isArrayLike } from "./is-array-like";

/**
 * Check if the provided value is a non-empty array-like object
 *
 * @param value - The value to type check
 * @returns An indicator specifying if the object provided is a non-empty array-like object
 */
export const isSetArray = (value: any): boolean => {
  return isArrayLike(value) && value.length > 0;
};
