/* -------------------------------------------------------------------

                       🗲 Storm Software - Stryke

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
 * Validates if a given timestamp is a valid Unix timestamp.
 *
 * @remarks
 * A valid Unix timestamp is a non-negative integer that represents the number of seconds since January 1, 1970 (the Unix epoch).
 *
 * @example
 * ```ts
 * isValidTimestamp(1700000000); // true
 * isValidTimestamp(-100); // false
 * isValidTimestamp(3.14); // false
 * ```
 *
 * @param timestamp - The timestamp to validate.
 * @returns `true` if the timestamp is valid, `false` otherwise.
 */
export function isValidTimestamp(timestamp: number): boolean {
  return Number.isInteger(timestamp) && timestamp >= 0;
}

/**
 * Validates if a given date string is a valid date.
 *
 * @remarks
 * A valid date string is one that can be parsed into a valid JavaScript `Date` object.
 *
 * @example
 * ```ts
 * isValidDateString("2024-01-15"); // true
 * isValidDateString("invalid-date"); // false
 * ```
 *
 * @param date - The date string to validate.
 * @returns `true` if the date string is valid, `false` otherwise.
 */
export function isValidDateString(date: string): boolean {
  return !Number.isNaN(new Date(date).getTime());
}
