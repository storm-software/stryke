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

export interface AppendPathOptions {
  /**
   * If `true`, the function will skip appending if the `childPath` is already a child of the `parentPath`.
   *
   * @defaultValue true
   */
  skipIfAlreadyParent?: boolean;
}

/**
 * If not already a parent path, append the base path from the beginning of the given child path.
 *
 * @example
 * ```ts
 * appendPath("src/index.ts", "/home/user/project");
 * // returns "/home/user/project/src/index.ts"
 *
 * appendPath("/user/dev/app.ts", "/user/dev");
 * // returns "/user/dev/app.ts"
 *
 * appendPath("docs/readme.md");
 * // returns "<current_working_directory>/docs/readme.md"
 *
 * appendPath("src/index.ts", "/home/user/project", { skipIfAlreadyParent: false });
 * // returns "/home/user/project/src/index.ts"
 *
 * appendPath("/home/user/project/src/index.ts", "/home/user/project", { skipIfAlreadyParent: false });
 * // returns "/home/user/project/src/index.ts"
 * ```
 *
 * @param childPath - The child path to append to the {@link parentPath}
 * @param parentPath - The parent path to add the {@link childPath} to
 * @param options - Options for appending the path
 * @returns The {@link parentPath} with the {@link childPath} appended
 */
export function appendPath(
  childPath: string,
  parentPath: string = cwd(),
  options: AppendPathOptions = {}
): string {
  return slash(
    options.skipIfAlreadyParent !== false && isParentPath(childPath, parentPath)
      ? childPath
      : joinPaths(parentPath, childPath)
  );
}

export const append = appendPath;

/**
 * Append the extension to the given path.
 *
 * @example
 * ```ts
 * appendExtension("/home/user/project/src/index", ".ts");
 * // returns "/home/user/project/src/index.ts"
 * appendExtension("/home/user/project/src/index.ts", ".js");
 * // returns "/home/user/project/src/index.ts.js"
 * ```
 *
 * @param path - The path to append the extension to.
 * @param extension - The extension to append.
 * @returns The path with the appended extension.
 */
export function appendExtension(path: string, extension: string): string {
  return `${path}.${extension.replace(/^\./, "")}`;
}
