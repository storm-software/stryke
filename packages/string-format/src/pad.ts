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
 * Pads string on the left and right sides if it's shorter than length. Padding characters are truncated if they can't be evenly divided by length.
 * If the length is less than or equal to the original string's length, or if the padding character is an empty string, the original string is returned unchanged.
 *
 * @param str - The string to pad.
 * @param length - The length of the resulting string once padded.
 * @param chars - The character(s) to use for padding.
 * @returns The padded string, or the original string if padding is not required.
 *
 * @example
 * ```ts
 * const result1 = pad('abc', 8);         // result will be '  abc   '
 * const result2 = pad('abc', 8, '_-');   // result will be '_-abc_-_'
 * const result3 = pad('abc', 3);         // result will be 'abc'
 * const result4 = pad('abc', 2);         // result will be 'abc'
 * ```
 */
export function pad(str: string, length: number, chars = " "): string {
  return str
    .padStart(Math.floor((length - str.length) / 2) + str.length, chars)
    .padEnd(length, chars);
}
