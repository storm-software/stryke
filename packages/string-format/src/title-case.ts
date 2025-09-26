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

import { combine } from "./combine";
import { decamelize } from "./decamelize";
import type { FormatSpecialCasesOptions } from "./format-special-cases";
import { formatSpecialCases } from "./format-special-cases";
import { upperCaseFirst } from "./upper-case-first";

/**
 * Convert a string to title case.
 *
 * @param input - The input string to convert.
 * @param options - Options for formatting special cases.
 * @returns The title cased string.
 */
export function titleCase<T extends string | undefined>(
  input: T,
  options?: FormatSpecialCasesOptions
): T {
  return input
    ?.split(/\s+-\s+/)
    .map(segment =>
      decamelize(segment)
        .split(/[\s\-_]/)
        .map(upperCaseFirst)
        .map((value: string, index: number, array: string[]) =>
          formatSpecialCases(value, index, array, options)
        )
        .reduce(combine)
    )
    .join(" - ") as T;
}
