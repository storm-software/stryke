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

import { slash } from "./slash";

/**
 * Check if a given path is a parent of another path.
 *
 * @example
 * ```ts
 * isParentPath("/home/user/project/src/index.ts", "/home/user/project/src");
 * // returns true
 * isParentPath("/home/user/project/src/index.ts", "/home/user/project");
 * // returns true
 * isParentPath("/home/user/project/src/index.ts", "/home/user/project/src/other");
 * // returns false
 * isParentPath("/home/user/project/src/index.ts", "/home/user/other");
 * // returns false
 * isParentPath("/home/user/project/src/index.ts", "/home/user/project/src/index.ts");
 * // returns false
 * ```
 *
 * @param childPath - The path to check if it is a child of the parent path.
 * @param parentPath - The path to check if it is a parent of the child path.
 * @returns `true` if `childPath` is a child of `parentPath`, otherwise `false`.
 */
export function isParentPath(childPath: string, parentPath: string): boolean {
  const normalizedChild = slash(
    childPath.replace(/\\/g, "/").replace(/\/$/, "")
  );
  const normalizedParent = slash(
    parentPath.replace(/\\/g, "/").replace(/\/$/, "")
  );

  return (
    normalizedChild !== normalizedParent &&
    normalizedChild.startsWith(`${normalizedParent}/`)
  );
}
