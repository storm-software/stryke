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

export const isBufferExists = typeof Buffer !== "undefined";

/**
 * Check if the provided value's type is `Buffer`
 */
export const isBuffer: typeof Buffer.isBuffer = isBufferExists
  ? Buffer.isBuffer.bind(Buffer)
  : /**
   * Check if the provided value's type is `Buffer`

   * @param value - The value to type check
   * @returns An indicator specifying if the value provided is of type `Buffer`
   */
    function isBuffer(
      value: Parameters<typeof Buffer.isBuffer>[0]
    ): value is Buffer {
      return false;
    };
