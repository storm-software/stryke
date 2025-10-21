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

import { joinPaths } from "./join-paths";

/**
 * Resolve the parent path of the provided path.
 *
 * @param path - The path to resolve.
 * @param count - The number of parent directories to traverse.
 * @returns The parent path of the provided path.
 */
export const resolveParentPath = (path: string, count: number = 1): string => {
  let parentPath = path.replaceAll(/\/+$/g, "");
  for (let i = 0; i < count; i++) {
    parentPath = joinPaths(parentPath, "..");
  }
  return parentPath;
};
