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

import { snakeCase } from "./snake-case";

/**
 * Convert the input string to constant case.
 *
 * @remarks
 * "THIS_IS_AN_EXAMPLE"
 *
 * @param input - The input string.
 * @returns The constant-cased string.
 */
export function constantCase<T extends string | undefined>(input: T): T {
  return snakeCase<T>(input)?.toUpperCase() as T;
}
