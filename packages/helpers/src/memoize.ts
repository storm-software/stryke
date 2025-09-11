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

/**
 * Memoizes a function based on its string identifier.
 *
 * @param fn - The function to memoize.
 * @returns A memoized version of the input function.
 */
export const memoizeOnId = <T>(fn: (id: string) => T) => {
  // eslint-disable-next-line ts/unbound-method
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  const results: Record<string, T> = {};

  const memoizedFn = (id: string) => {
    if (hasOwnProperty.call(results, id)) {
      return results[id];
    }
    return (results[id] = fn(id));
  };

  return memoizedFn;
};
