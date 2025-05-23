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

/**
 * Removes empty items from an array
 *
 * @param arr - The array to remove empty items from
 * @returns The array with empty items removed
 */
export const removeEmptyItems = <T = any>(
  arr: (T | undefined | null)[]
): NonNullable<T>[] => arr.filter(Boolean) as NonNullable<T>[];
