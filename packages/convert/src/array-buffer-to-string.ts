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
 * Convert an ArrayBuffer or Uint8Array to a string
 *
 * @param buffer - The ArrayBuffer or Uint8Array to convert
 * @returns The converted string
 */
export function arrayBufferToString(
  buffer: ArrayBuffer | ArrayBufferLike | Uint8Array
): string {
  const bytes =
    buffer instanceof Uint8Array
      ? buffer
      : new Uint8Array(buffer as ArrayBufferLike);
  const len = bytes.byteLength;
  if (len < 65535) {
    return String.fromCharCode.apply(null, bytes as unknown as number[]);
  }
  let binary = "";
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return binary;
}
