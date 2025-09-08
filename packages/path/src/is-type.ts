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

import { ABSOLUTE_PATH_REGEX } from "./regex";
import { slash } from "./slash";

/**
 * Check if the path is an absolute path.
 *
 * @param path - The path to check
 * @returns An indicator specifying if the path is an absolute path
 */
export function isAbsolutePath(path: string): boolean {
  return ABSOLUTE_PATH_REGEX.test(slash(path));
}

/**
 * Check if the path is an absolute path.
 *
 * @remarks
 * This is an alias for {@link isAbsolutePath}.
 *
 * @param path - The path to check
 * @returns An indicator specifying if the path is an absolute path
 */
export function isAbsolute(path: string): boolean {
  return isAbsolutePath(path);
}

/**
 * Check if the path is a relative path.
 *
 * @param path - The path to check
 * @returns An indicator specifying if the path is a relative path
 */
export function isRelativePath(path: string): boolean {
  return !isAbsolutePath(path);
}

/**
 * Check if the path is a relative path.
 *
 * @remarks
 * This is an alias for {@link isRelativePath}.
 *
 * @param path - The path to check
 * @returns An indicator specifying if the path is a relative path
 */
export function isRelative(path: string): boolean {
  return isRelativePath(path);
}
