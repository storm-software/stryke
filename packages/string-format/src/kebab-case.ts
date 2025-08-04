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

/**
 * Check if the input string is in kebab case.
 *
 * @remarks
 * Kebab case is defined as all lowercase letters with hyphens separating words - "this-is-an-example".
 *
 * @param input - The input string to check.
 * @returns True if the input is in kebab case, false otherwise.
 */
export function isKebabCase(input: string | undefined): boolean {
  return input ? /^[a-z]+(?:-[a-z0-9]+)*$/.test(input) : false;
}

/**
 * Convert the input string to kebab case.
 *
 * @remarks
 * Kebab case is defined as all lowercase letters with hyphens separating words - "this-is-an-example".
 *
 * @param input - The input string.
 * @returns The kebab-cased string.
 */
export function kebabCase<T extends string | undefined>(input: T): T {
  if (isKebabCase(input) || input === undefined) {
    return input;
  }

  const parts = input ? getWords(input) : [];
  if (parts.length === 0) {
    return "" as T;
  }

  return parts.join("-").toLowerCase() as T;
}
