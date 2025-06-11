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

import { isNumber } from "./is-number";
import { isString } from "./is-string";

/**
 * Check if the provided value's type is an integer
 *
 * @param value - The value to type check
 * @returns An indicator specifying if the value provided is of type `number` and is an integer
 */
export const isInteger = (value: unknown): boolean =>
  !isString(value) && isNumber(value) && value % 1 === 0;
