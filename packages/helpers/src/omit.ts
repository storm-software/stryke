/* -------------------------------------------------------------------

                             ⚡ Storm Software 

 This code was released as part of a Storm Software project. The project
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/license.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software
 Documentation:            https://stormsoftware.com/docs
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

/**
 * Creates a new object with specified keys omitted.
 *
 * This function takes an object and an array of keys, and returns a new object that
 * excludes the properties corresponding to the specified keys.
 *
 * @param obj - The object to omit keys from.
 * @param keys - An array of keys to be omitted from the object.
 * @returns A new object with the specified keys omitted.
 *
 * @example
 * ```typescript
 * const obj = { a: 1, b: 2, c: 3 };
 * const result = omit(obj, ['b', 'c']);
 * // result will be { a: 1 }
 * ```
 */
export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Omit<T, K> {
  const result = { ...obj };

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (key) {
      delete result[key];
    }
  }

  return result as Omit<T, K>;
}
