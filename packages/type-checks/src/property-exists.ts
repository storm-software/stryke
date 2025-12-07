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

import { isObject } from "./is-object";

/**
 * Check if the provided object has the provided property
 *
 * @param object - The object to check
 * @param propertyKey - The property to check
 * @returns An indicator specifying if the object has the provided property
 */
export const propertyExists = (object: any, propertyKey: PropertyKey) => {
  try {
    return isObject(object) && propertyKey in object;
  } catch {
    return false;
  }
};

/**
 * Check if the provided object has the provided property and if it's safe to merge
 *
 * @param object - The object to check
 * @param propertyKey - The property to check
 * @returns An indicator specifying if the object has the provided property and if it's safe to merge
 */
export const propertyUnsafe = (object: any, propertyKey: PropertyKey) => {
  return (
    propertyExists(object, propertyKey) && // Properties are safe to merge if they don't exist in the target yet,
    !(
      Object.hasOwnProperty.call(object, propertyKey) && // unsafe if they exist up the prototype chain,
      Object.propertyIsEnumerable.call(object, propertyKey)
    )
  ); // and also unsafe if they're non-enumerable.
};
