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
 * Check if the input string is in pascal case.
 *
 * @remarks
 * Pascal case is defined as an uppercase first letter followed by any number of lowercase letters and digits - "ThisIsAnExample".
 *
 * @param input - The input string to check.
 * @returns True if the input is in pascal case, false otherwise.
 */
export function isPascalCase(input: string | undefined): boolean {
  return input ? /^[A-Z][a-zA-Z0-9]*$/.test(input) : false;
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
      : input
          .split(" ")
          .map(i => i.split("-"))
          .flat()
          .map(i =>
            i.length > 0
              ? i.trim().charAt(0).toUpperCase() + i.trim().slice(1)
              : ""
          )
          .join("")
  ) as T;
}
