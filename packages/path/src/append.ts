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

import { cwd } from "./cwd";
import { isParentPath } from "./is-parent-path";
import { joinPaths } from "./join-paths";
import { slash } from "./slash";

/**
 * Append the base path from the beginning of the given path.
 *
 * @example
 * ```ts
 * appendPath("/home/user/project/src/index.ts", "/home/user/project");
 * // returns "src/index.ts"
 * ```
 *
 * @param childPath - The child path to append to the {@link parentPath}
 * @param parentPath - The parent path to add the {@link childPath} to
 * @returns The {@link parentPath} with the {@link childPath} appended
 */
export function appendPath(
  childPath: string,
  parentPath: string = cwd()
): string {
  return slash(
    !isParentPath(childPath, parentPath)
      ? joinPaths(childPath, parentPath)
      : childPath
  );
}

export const append = appendPath;
