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

import type { AnyNumber } from "@stryke/types/base";
import { getObjectTag } from "./get-object-tag";

/**
 * Check if the provided value's type is `number`
 *
 * @param value - The value to type check
 * @returns An indicator specifying if the value provided is of type `number`
 */
export const isNumber = (value: unknown): value is number => {
  try {
    return (
      value instanceof Number ||
      typeof value === "number" ||
      Number(value) === value
    );
  } catch {
    return false;
  }
};

/**
 * Check if the provided value's type is `AnyNumber`
 *
 * @param value - The value to type check
 * @returns An indicator specifying if the value provided is of type `AnyNumber`
 */
export function isAnyNumber(value?: any): value is AnyNumber {
  return isNumber(value) || getObjectTag(value) === "[object Number]";
}
