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

import type { CopySyncOptions } from "node:fs";
import { constants, copyFileSync, cpSync } from "node:fs";

/**
 * Copy files from one location to another
 *
 * @param from - The source location
 * @param to - The destination location
 * @param options - The copy options
 * @returns An indicator specifying if the copy was successful
 */
export const copyFiles = (
  from: string,
  to: string,
  options?: CopySyncOptions
) => {
  return cpSync(from, to, options);
};

/**
 * Copy a file from one location to another
 *
 * @param file - The file to copy
 * @param to - The destination location
 * @returns An indicator specifying if the copy was successful
 */
export const copyFile = (file: string, to: string) => {
  return copyFileSync(file, to, constants.COPYFILE_FICLONE);
};
