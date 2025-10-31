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

import { isAbsolutePath } from "./is-type";

/**
 * Replace backslash to slash
 *
 * @param path - The string to replace
 * @returns The string with replaced backslashes
 */
export function slash(path: string) {
  if (path.startsWith("\\\\?\\")) {
    return path;
  }

  return path.replace(/\\/g, "/");
}

/**
 * Replace backslash to slash and remove unneeded leading and trailing slashes
 *
 * @param path - The string to replace
 * @returns The string with replaced backslashes
 */
export function formatSlash(path: string) {
  const formatted = slash(path);

  return isAbsolutePath(formatted)
    ? formatted.replace(/\/+$/g, "")
    : formatted.replace(/^\.\//g, "").replace(/\/+$/g, "");
}
