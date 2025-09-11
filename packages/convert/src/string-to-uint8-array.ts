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
export function stringToUint8Array(text: string): Uint8Array {
  return Uint8Array.from(
    [...encodeURIComponent(text)].map(letter => letter.codePointAt(0)!)
  );
}

/**
 * Convert a binary string to Uint8Array
 *
 * @param binary - The binary string to convert
 * @returns The converted Uint8Array
 */
export function binaryStringToUint8Array(binary: string): Uint8Array {
  const len = binary.length;
  const arr = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    arr[i] = binary.charCodeAt(i);
  }
  return arr;
}

/**
 * Convert a base64 string to a Uint8Array
 *
 * @param data - The base64 string to convert
 * @returns The converted Uint8Array
 */
export function base64StringToUint8Array(data: string): Uint8Array {
  return stringToUint8Array(atob(data));
}
