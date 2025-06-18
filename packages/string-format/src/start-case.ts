/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/projects/stryke/license.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://docs.stormsoftware.com/projects/stryke
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import { getWords } from "./get-words";

/**
 * Converts the first character of each word in a string to uppercase and the remaining characters to lowercase.
 *
 * @remarks
 * "This Is An Example"
 *
 * Start case is the naming convention in which each word is written with an initial capital letter.
 *
 * @example
 * ```ts
 * const result1 = startCase('hello world');  // result will be 'Hello World'
 * const result2 = startCase('HELLO WORLD');  // result will be 'Hello World'
 * const result3 = startCase('hello-world');  // result will be 'Hello World'
 * const result4 = startCase('hello_world');  // result will be 'Hello World'
 * ```
 *
 * @param input - The string to convert.
 * @returns The converted string.
 */
export function startCase<T extends string | undefined>(input?: T): T {
  if (!input) {
    return input as T;
  }

  const words = getWords(input.trim());

  let result = "";
  for (const word of words) {
    if (word && word[0]) {
      if (result) {
        result += " ";
      }
      result +=
        word === word.toUpperCase()
          ? word
          : word[0].toUpperCase() + word.slice(1).toLowerCase();
    }
  }

  return result as T;
}
