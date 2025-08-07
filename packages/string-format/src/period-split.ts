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

import { EMPTY_STRING } from "@stryke/types";
import { upperCaseFirst } from "./upper-case-first";

/**
 * Check if the input string is in snake case.
 *
 * @remarks
 * Snake case is defined as all lowercase letters with underscores separating words - "this_is_an_example"
 *
 * @param input - The input string to check.
 * @returns True if the input is in snake case, false otherwise.
 */
export function isPeriodSplit(input: string | undefined): boolean {
  return input ? /^[a-z]+(?:\.[a-z0-9]+)*$/.test(input) : false;
}

/**
 * Make all characters lowercase and add a period in between each word
 *
 * @remarks
 * "this.is.an.example"
 *
 * @param input - The input string.
 * @returns The period-split string.
 */
export function periodSplit<T extends string | undefined>(input?: T): T {
  if (!input || isPeriodSplit(input)) {
    return input as T;
  }

  const parts =
    input
      ?.replace(
        /[A-Z]+/g,
        (input?: string) => upperCaseFirst(input) ?? EMPTY_STRING
      )
      ?.split(/(?=[A-Z])|[\s._-]/)
      .map(x => x.toLowerCase()) ?? [];
  if (parts.length === 0) {
    return "" as T;
  }
  if (parts.length === 1) {
    return parts[0] as T;
  }

  return parts.reduce((ret: string, part: string) => {
    return `${ret}.${part.toLowerCase()}`.toLowerCase();
  }) as T;
}
