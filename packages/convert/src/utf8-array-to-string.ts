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
 * Convert a utf8 array to string
 *
 * @credits https://stackoverflow.com/a/41798356/1465919
 * @credits https://stackoverflow.com/a/36949791/1465919
 *
 * @param arr - Utf-8 Array
 * @returns The converted string
 */
export const utf8ArrayToString = (arr: Uint8Array) => {
  return new TextDecoder().decode(arr);
};
