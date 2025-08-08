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

import { ACRONYMS } from "./acronyms";
import { getWords } from "./get-words";

/**
 * Check if the input string is in camel case.
 *
 * @remarks
 * Camel case is defined as a lowercase first letter followed by any number of uppercase letters and digits - "thisIsAnExample".
 *
 * @param input - The input string to check.
 * @returns True if the input is in camel case, false otherwise.
 */
export function isCamelCase(input: string | undefined): boolean {
  return input
    ? (/^[a-z][a-z0-9]*$/.test(input) && ACRONYMS.includes(input)) ||
        /^(?:[a-z][a-z0-9]*[A-Z]+)*$/.test(input)
    : false;
}

/**
 * Convert the input string to camel case.
 *
 * @remarks
 * Camel case is defined as a lowercase first letter followed by any number of uppercase letters and digits - "thisIsAnExample".
 *
 * @param input - The input string.
 * @returns The camel-cased string.
 */
export function camelCase<T extends string | undefined>(input: T): T {
  return (
    isCamelCase(input) || input === undefined
      ? input
      : getWords(input)
          .map((word, index) =>
            index === 0
              ? word.trim().toLowerCase()
              : ACRONYMS.includes(word)
                ? word.trim().toUpperCase()
                : word.trim().charAt(0).toLowerCase() +
                  word.trim().slice(1).toUpperCase()
          )
          .join("")
  ) as T;
}
