/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/license.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://docs.stormsoftware.com/projects/stryke
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import { getWords } from "./get-words";

/**
 * Convert the input string to kebab case.
 *
 * @remarks
 * "this-is-an-example"
 *
 * @param input - The input string.
 * @returns The kebab-cased string.
 */
export function kebabCase<T extends string | undefined>(input: T): T {
  const parts = input ? getWords(input) : [];
  if (parts.length === 0) {
    return "" as T;
  }

  return parts.join("-").toLowerCase() as T;
}
