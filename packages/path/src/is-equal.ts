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

export interface IsEqualOptions {
  /**
   * Whether to ignore case sensitivity when comparing paths.
   * @default false
   */
  ignoreCase?: boolean;
}

/**
 * Check if two paths are equal.
 *
 * @example
 * ```ts
 * isEqual("/home/user/project/src/index.ts", "/home/user/project/src/index.ts");
 * // returns true
 * isEqual("/home/user/project/src/index.ts", "/home/user/project");
 * // returns false
 * isEqual("/home/user/project/src/index.ts", "/home/user/project/src/other");
 * // returns false
 * isEqual("/home/user/project/src/index.ts", "/home/user/other");
 * // returns false
 * isEqual("/home/user/project/src/index.ts", "/home/user/project/src/index.ts");
 * // returns true
 * isEqual("/home/user/project/src/index.ts", "/home/user/project/src/index.ts", { ignoreCase: true });
 * // returns true
 * isEqual("/home/user/project/src/index.ts", "/home/user/project/src/INDEX.TS", { ignoreCase: true });
 * // returns true
 * isEqual("/home/user/project/src/index.ts", "/home/user/project/src/INDEX.TS");
 * // returns false
 * isEqual("/home/user/project/src/index.ts", "/home/user/project/src/index.ts/");
 * // returns true
 * isEqual("/home/user/project/src/index.ts", "/home/user/project/src/index.ts/", { ignoreCase: true });
 * // returns true
 * ```
 *
 * @param path1 - The first path to compare.
 * @param path2 - The second path to compare.
 * @returns `true` if `path1` is equal to `path2`, otherwise `false`.
 */
export function isEqual(
  path1: string,
  path2: string,
  options?: IsEqualOptions
): boolean {
  const { ignoreCase = false } = options ?? {};

  const normalizedPath1 = slash(
    path1.replaceAll(/\\/g, "/").replace(/\/*$/, "")
  );
  const normalizedPath2 = slash(
    path2.replaceAll(/\\/g, "/").replace(/\/*$/, "")
  );

  return (
    (ignoreCase && path1?.toLowerCase() === path2?.toLowerCase()) ||
    (!ignoreCase && path1 === path2) ||
    (ignoreCase &&
      normalizedPath1?.toLowerCase() === normalizedPath2?.toLowerCase()) ||
    (!ignoreCase && normalizedPath1 === normalizedPath2)
  );
}
