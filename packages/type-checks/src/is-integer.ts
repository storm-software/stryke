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

import type { Integer } from "@stryke/types/number";
import { isNumber } from "./is-number";
import { isString } from "./is-string";

/**
 * Check if the provided value's type is an integer
 *
 * @param value - The value to type check
 * @returns An indicator specifying if the value provided is of type `number` and is an integer
 */
export const isInteger = <T extends number>(value: T): value is Integer<T> =>
  isNumber(value) && !isString(value) && value % 1 === 0;
