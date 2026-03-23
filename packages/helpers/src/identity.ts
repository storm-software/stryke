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
 * Returns the input value unchanged.
 *
 * @example
 * ```ts
 * identity(5); // Returns 5
 * identity('hello'); // Returns 'hello'
 * identity({ key: 'value' }); // Returns { key: 'value' }
 * ```
 *
 * @param x - The value to be returned.
 * @returns The input value.
 */
export function identity<T>(x: T): T {
  return x;
}
