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
 * Converts a number to its ordinal representation (e.g., 1st, 2nd, 3rd, etc.).
 *
 * @example
 * ```typescript
 * toOrdinal(1); // "1st"
 * toOrdinal(2); // "2nd"
 * toOrdinal(3); // "3rd"
 * toOrdinal(4); // "4th"
 * toOrdinal(11); // "11th"
 * toOrdinal(12); // "12th"
 * toOrdinal(13); // "13th"
 * toOrdinal(21); // "21st"
 * ```
 *
 * @param int - The number to convert to an ordinal string.
 * @returns The ordinal representation of the number as a string.
 */
export function toOrdinal(int: number): string {
  const j = int % 10;
  const k = int % 100;
  if (j === 1 && k !== 11) {
    return `${int}st`;
  }
  if (j === 2 && k !== 12) {
    return `${int}nd`;
  }
  if (j === 3 && k !== 13) {
    return `${int}rd`;
  }
  return `${int}th`;
}
