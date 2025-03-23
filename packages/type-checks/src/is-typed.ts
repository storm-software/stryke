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

import type { ITyped } from "@stryke/types/base";
import { isObject } from "./is-object";
import { isSet } from "./is-set";

/**
 * Check if the provided value has a `__typename` property
 *
 * @param value - The value to type check
 * @returns An indicator specifying if the value provided has a `__typename` property
 */
export const isTyped = (value: unknown): value is ITyped => {
  try {
    return isSet(value) && isObject(value) && "__typename" in value;
  } catch {
    return false;
  }
};
