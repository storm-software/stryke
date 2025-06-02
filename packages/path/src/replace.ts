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

import { slash } from "./slash";

/**
 * Replace the base path from the beginning of the given path.
 *
 * @example
 * ```ts
 * replacePath("/home/user/project/src/index.ts", "/home/user/project");
 * // returns "src/index.ts"
 * ```
 *
 * @param path - The path string to replace a substring from
 * @param base - The base path to remove from the beginning of the {@link path}
 * @returns The {@link path} with the {@link base} path removed
 */
export function replacePath(
  path: string,
  base: string = process.cwd()
): string {
  return slash(path).replace(slash(base), "").replace(/^\//, "");
}
