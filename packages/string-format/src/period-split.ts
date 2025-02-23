/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 License, and is
 free for commercial and private use. For more information, please visit
 our licensing page.

 Website:         https://stormsoftware.com
 Repository:      https://github.com/storm-software/stryke
 Documentation:   https://stormsoftware.com/projects/stryke/docs
 Contact:         https://stormsoftware.com/contact
 License:         https://stormsoftware.com/projects/stryke/license

 ------------------------------------------------------------------- */

import { EMPTY_STRING } from "@stryke/types";
import { upperCaseFirst } from "./upper-case-first";

/**
 * Make all characters lowercase and add a period in between each word
 *
 * @remarks
 * "this.is.an.example"
 *
 * @param input - The input string.
 * @returns The period-split string.
 */
export const periodSplit = (input?: string): string | undefined => {
  const parts =
    input
      ?.replace(
        /[A-Z]+/g,
        (input?: string) => upperCaseFirst(input) ?? EMPTY_STRING,
      )
      ?.split(/(?=[A-Z])|[\s._-]/)
      .map((x) => x.toLowerCase()) ?? [];
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];

  return parts.reduce((ret: string, part: string) => {
    return `${ret}.${part.toLowerCase()}`.toLowerCase();
  });
};
