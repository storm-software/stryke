/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/projects/stryke/license.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://docs.stormsoftware.com/projects/stryke
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

/**
 * Upper case the first character of an input string.
 *
 *  @remarks
 * "Thisisanexample"
 *
 * @param input - The input string.
 * @returns The capitalized string.
 */
export function upperCaseFirst<T extends string | undefined>(input?: T): T {
  return (input ? input.charAt(0).toUpperCase() + input.slice(1) : input) as T;
}
