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
 * Convert an array of strings into a human-readable list string.
 *
 * @example
 * list(["apple", "banana", "cherry"]) // "apple, banana, and cherry"
 * list(["apple", "banana"]) // "apple and banana"
 * list(["apple"]) // "apple"
 * list("apple") // "apple"
 *
 * @param strings - The array of strings or a single string to convert into a list.
 * @returns The converted list string.
 */
export function list(strings: string | string[]): string {
  if (typeof strings === "string") {
    return strings;
  }

  if (strings.length === 0) {
    return "";
  }

  if (strings.length === 1) {
    return strings[0]!;
  }

  if (strings.length === 2) {
    return `${strings[0]} and ${strings[1]}`;
  }

  const last = strings.pop();

  return `${strings.join(", ")}, and ${last}`;
}
