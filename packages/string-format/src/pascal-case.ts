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
 * Check if the input string is in pascal case.
 *
 * @remarks
 * Pascal case is defined as an uppercase first letter followed by any number of lowercase letters and digits - "ThisIsAnExample".
 *
 * @param input - The input string to check.
 * @returns True if the input is in pascal case, false otherwise.
 */
export function isPascalCase(input: string | undefined): boolean {
  return input
    ? (/^[A-Z][A-Z0-9]*$/.test(input) && ACRONYMS.includes(input)) ||
        /^(?:[A-Z][A-Z0-9]*[a-z]+)*$/.test(input)
    : false;
}

/**
 * Convert the input string to pascal case.
 *
 *  @remarks
 * Pascal case is defined as an uppercase first letter followed by any number of lowercase letters and digits - "ThisIsAnExample".
 *
 * @param input - The input string.
 * @returns The pascal-cased string.
 */
export function pascalCase<T extends string | undefined>(input?: T): T {
  return (
    isPascalCase(input) || input === undefined
      ? input
      : getWords(input)
          .map(word =>
            ACRONYMS.includes(word)
              ? word.trim().toUpperCase()
              : word.trim().charAt(0).toUpperCase() +
                word.trim().slice(1).toLowerCase()
          )
          .join("")
  ) as T;
}
