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

import { toArray } from "@stryke/convert/to-array";
import { cwd as currentDir } from "@stryke/path/cwd";
import { joinPaths } from "@stryke/path/join-paths";
import { resolveParentPath } from "@stryke/path/resolve-parent-path";
import { existsSync } from "node:fs";

export interface GetParentPathOptions {
  /**
   * Whether to ignore the case of the file names when checking for existence.
   *
   * @defaultValue true
   */
  ignoreCase: boolean;

  /**
   * Whether to skip the current working directory when checking for the file.
   *
   * @defaultValue false
   */
  skipCwd: boolean;

  /**
   * Should we include the found file/directory name in the results.
   *
   * @defaultValue false
   */
  includeNameInResults?: boolean;
}

/**
 * Get the first parent path that has a file or directory with the provided name.
 *
 * @param name - The name (or names) of the file to look for in the parent paths.
 * @param cwd - The current working directory.
 * @returns The first parent path that exists.
 */
export const getParentPath = (
  name: string | string[],
  cwd = currentDir(),
  options: Partial<GetParentPathOptions> = {}
): string | undefined => {
  const ignoreCase = options?.ignoreCase ?? true;
  const skipCwd = options?.skipCwd ?? false;
  const includeNameInResults = options?.includeNameInResults ?? false;

  let dir = cwd;
  if (skipCwd) {
    dir = resolveParentPath(cwd);
  }

  let names = toArray(name);
  if (ignoreCase) {
    names = names.map(name => name.toLowerCase());
  }

  while (true) {
    const target = names.find(name => existsSync(joinPaths(dir, name)));
    if (target) {
      return includeNameInResults ? joinPaths(dir, target) : dir;
    }

    const parentDir = resolveParentPath(dir);
    if (parentDir === dir) {
      // It'll fail anyway
      return undefined;
    }

    dir = parentDir;
  }
};
