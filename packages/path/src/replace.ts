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

import { isParentPath } from "./is-parent-path";
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
 * @param childPath - The child path to replace the {@link parentPath} substring from
 * @param parentPath - The parent path to remove from the {@link childPath} parameter
 * @returns The {@link childPath} with the {@link parentPath} path removed
 */
export function replacePath(
  childPath: string,
  parentPath: string = process.cwd()
): string {
  return isParentPath(childPath, parentPath)
    ? slash(childPath).replace(slash(parentPath), "").replace(/^\//, "")
    : childPath;
}
