/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/projects/stryke/license.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://docs.stormsoftware.com/projects/stryke
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import { EMPTY_STRING } from "@stryke/types";
import { upperCaseFirst } from "./upper-case-first";

export interface SnakeCaseOptions {
  splitOnNumber: boolean;
}

/**
 * Convert the input string to snake case.
 *
 *  @remarks
 * "this_is_an_example"
 *
 * @param input - The input string.
 * @param options - Options to control the behavior of the function.
 * @returns The snake-cased string.
 */
export function snakeCase<T extends string | undefined>(
  input: T,
  options?: SnakeCaseOptions
): T {
  if (!input) {
    return input;
  }

  const parts =
    input
      ?.replace(
        /[A-Z]+/g,
        (input?: string) => upperCaseFirst(input) ?? EMPTY_STRING
      )
      .split(/(?=[A-Z])|[\s._-]/)
      .map((x: string) => x.toLowerCase()) ?? [];
  if (parts.length === 0) {
    return "" as T;
  }
  if (parts.length === 1) {
    return parts[0] as T;
  }
  const result = parts.reduce((ret: string, part: string) => {
    return `${ret}_${part.toLowerCase()}`;
  });

  return (
    options?.splitOnNumber === false
      ? result
      : result.replace(/[A-Z]\d/i, (val: string) => `${val[0]}_${val[1]}`)
  ) as T;
}
