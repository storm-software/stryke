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

import { isBoolean, isSetString } from "@stryke/type-checks";

export const BOOLEAN_TRUE_STRINGS = new Set([
  "true",
  "t",
  "1",
  "yes",
  "y",
  "on"
]);
export const BOOLEAN_FALSE_STRINGS = new Set([
  "false",
  "f",
  "0",
  "no",
  "n",
  "off"
]);

/**
 * Convert a value to a boolean. If the value is a string, it will be converted to a boolean based on common truthy and falsy string values. If the value is already a boolean, it will be returned as is. For all other values, the standard JavaScript truthiness will be applied.
 *
 * @example
 * ```ts
 * toBool(true); // returns true
 * toBool(false); // returns false
 * toBool("true"); // returns true
 * toBool("false"); // returns false
 * toBool("yes"); // returns true
 * toBool("no"); // returns false
 * toBool("1"); // returns true
 * toBool("0"); // returns false
 * toBool("on"); // returns true
 * toBool("off"); // returns false
 * toBool(1); // returns true
 * toBool(0); // returns false
 * ```
 *
 * @param value - The value to convert to a boolean
 * @returns The boolean representation of the provided value
 */
export function toBool(value: unknown): boolean {
  if (isBoolean(value)) {
    return value;
  }
  if (isSetString(value)) {
    if (BOOLEAN_TRUE_STRINGS.has(value.toLowerCase())) {
      return true;
    }
    if (BOOLEAN_FALSE_STRINGS.has(value.toLowerCase())) {
      return false;
    }
  }
  if (Number.parseFloat(String(value)) === 1) {
    return true;
  }
  if (Number.parseFloat(String(value)) === 0) {
    return false;
  }

  return Boolean(value);
}
