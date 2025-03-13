/*-------------------------------------------------------------------

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

 -------------------------------------------------------------------*/

import { Collection } from "@stryke/types/base";
import { typeDetect } from "./type-detect";

const COLLECTION_TYPE_SET = new Set([
  "Arguments",
  "Array",
  "Map",
  "Object",
  "Set"
]);

/**
 * Check if the provided value's type is `Collection`
 *
 * @param value - The value to type check
 * @returns An indicator specifying if the value provided is of type `Collection`
 */
export function isCollection(value: any): value is Collection {
  return COLLECTION_TYPE_SET.has(typeDetect(value));
}
