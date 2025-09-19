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

import { arrayBufferToString } from "./array-buffer-to-string";

/**
 * Convert a Uint8Array to a base64 string
 *
 * @param buffer - The Uint8Array to convert
 * @returns The converted base64 string
 */
export function uint8ArrayToString(buffer: Uint8Array): string {
  return btoa(arrayBufferToString(buffer));
}
