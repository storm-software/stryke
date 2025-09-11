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

import { Buffer } from "node:buffer";

/**
 * Converts a string to a Buffer.
 *
 * @param str - The string to convert.
 * @returns The converted Buffer.
 *
 * @example
 * ```ts
 * import { stringToBuffer } from "@stryke/convert";
 *
 * const buffer = stringToBuffer("Hello, world!");
 * console.log(buffer); // <Buffer 48 65 6c 6c 6f 2c 20 77 6f 72 6c 64 21>
 * ```
 * @see https://nodejs.org/api/buffer.html#buffer_class_buffer
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Buffer
 * @see https://stackoverflow.com/a/41798356/1465919
 *
 */
export function stringToBuffer(str: string): Buffer {
  return Buffer.from(str, "utf8");
}
