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
 * Convert a string to Uint8Array
 *
 * @param text - The text to convert
 * @returns The converted Uint8Array
 */
export const stringToUint8Array = (text: string): Uint8Array =>
  Uint8Array.from(
    [...encodeURIComponent(text)].map(letter => letter.codePointAt(0)!)
  );
