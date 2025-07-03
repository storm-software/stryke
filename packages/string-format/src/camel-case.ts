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

import { lowerCaseFirst } from "./lower-case-first";
import { pascalCase } from "./pascal-case";

/**
 * Convert the input string to camel case.
 *
 * @remarks
 * "thisIsAnExample"
 *
 * @param input - The input string.
 * @returns The camel-cased string.
 */
export function camelCase<T extends string | undefined>(input: T): T {
  return input ? lowerCaseFirst(pascalCase(input)) : input;
}
