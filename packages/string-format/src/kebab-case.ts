/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/projects/stryke/license.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://stormsoftware.com/projects/stryke/docs
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import { EMPTY_STRING } from "@stryke/types";
import { upperCaseFirst } from "./upper-case-first";

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
  const parts =
    input
      ?.replace(
        /[A-Z]+/g,
        (input?: string) => upperCaseFirst(input) ?? EMPTY_STRING
      )
      ?.split(/(?=[A-Z])|[\s._-]/)
      .map(x => x.toLowerCase()) ?? [];
  if (parts.length === 0) return "" as T;
  if (parts.length === 1) return parts[0] as T;

  return parts.reduce((ret: string, part: string) => {
    return `${ret}-${part.toLowerCase()}`.toLowerCase();
  }) as T;
}
