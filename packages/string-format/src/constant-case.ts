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

import { getWords } from "./get-words";
import { isSnakeCase } from "./snake-case";

/**
 * Check if the input string is in constant case.
 *
 * @remarks
 * Constant case is defined as all uppercase letters with underscores separating words - "THIS_IS_AN_EXAMPLE".
 *
 * @param input - The input string to check.
 * @returns True if the input is in constant case, false otherwise.
 */
export function isConstantCase(input: string | undefined): boolean {
  return input ? /^[A-Z0-9_]+$/.test(input) : false;
}

/**
 * Convert the input string to constant case.
 *
 * @remarks
 * Constant case is defined as all uppercase letters with underscores separating words - "THIS_IS_AN_EXAMPLE".
 *
 * @param input - The input string.
 * @returns The constant-cased string.
 */
export function constantCase<T extends string | undefined>(input: T): T {
  return isConstantCase(input) || input === undefined
    ? input
    : isSnakeCase(input)
      ? (input.toUpperCase() as T)
      : (getWords(input).join("_").toUpperCase() as T);
}
