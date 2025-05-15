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

import { ACRONYMS } from "./acronyms";
import { upperCaseFirst } from "./upper-case-first";

/**
 * Convert the input string to title case.
 *
 *  @remarks
 * "This Is An Example"
 *
 * @param input - The input string.
 * @returns The title cased string.
 */
export function titleCase<T extends string | undefined>(input?: T): T {
  if (!input) {
    return input as T;
  }

  const formatSegment = (segment: string) =>
    segment
      .toLowerCase()
      .split(/[\s\-_]+/)
      .filter(Boolean)
      .map(word => {
        if (ACRONYMS.includes(word.toUpperCase())) {
          return word.toUpperCase();
        }

        return `${upperCaseFirst(word.toLowerCase())}`;
      })
      .join(" ");

  return input
    .split(/\s+-\s+/)
    .map(part => formatSegment(part))
    .join(" - ") as T;
}
