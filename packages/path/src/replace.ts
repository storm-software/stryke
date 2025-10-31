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

import { correctPath } from "./correct-path";
import { cwd } from "./cwd";
import {
  findFileDotExtensionSafe,
  findFileExtensionSafe
} from "./file-path-fns";
import { isParentPath } from "./is-parent-path";
import { formatSlash } from "./slash";

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
  parentPath: string = cwd()
): string {
  return formatSlash(
    correctPath(
      isParentPath(childPath, parentPath)
        ? formatSlash(childPath)
            .replace(formatSlash(parentPath), "")
            .replace(/^\/+/g, "")
        : childPath
    )
  );
}

/**
 * Replace the extension of a given path with the provided value.
 *
 * @example
 * ```ts
 * replaceExtension("/home/user/project/src/index.ts", ".js");
 * // returns "/home/user/project/src/index.js"
 * replaceExtension("/home/user/project/src/index.ts");
 * // returns "/home/user/project/src/index"
 * ```
 *
 * @param path - The path that will have its current extension replaced
 * @param replacement - The value (or an empty string) to replace the current extension with
 * @returns The path with the replaced extension
 */
export function replaceExtension(path: string, replacement = ""): string {
  return correctPath(
    path.replace(
      !replacement || replacement.includes(".")
        ? findFileDotExtensionSafe(path)
        : findFileExtensionSafe(path),
      replacement
    )
  );
}
