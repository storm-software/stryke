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

/**
 * Returns an array of unique values from the given array.
 *
 * @param arr - The array to get unique values from.
 * @returns An array of unique values.
 */
export const getUnique = <T = any>(arr: T[]): T[] => {
  return [...new Set(arr)];
};

/**
 * Returns a new array containing only the unique elements from the original array,
 * based on the values returned by the mapper function.
 *
 * @example
 * ```ts
 * uniqBy([1.2, 1.5, 2.1, 3.2, 5.7, 5.3, 7.19], Math.floor);
 * // [1.2, 2.1, 3.2, 5.7, 7.19]
 * ```
 *
 * @param arr - The array to process.
 * @param mapper - The function used to convert the array elements.
 * @returns A new array containing only the unique elements from the original array, based on the values returned by the mapper function.
 */
export function getUniqueBy<T, U>(
  arr: readonly T[],
  mapper: (item: T) => U,
): T[] {
  const map = new Map<U, T>();

  for (const item of arr) {
    const key = mapper(item);

    if (!map.has(key)) {
      map.set(key, item);
    }
  }

  return [...map.values()];
}
