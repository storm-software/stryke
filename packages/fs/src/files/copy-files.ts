/*-------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 License, and is
 free for commercial and private use. For more information, please visit
 our licensing page.

 Website:         https://stormsoftware.com
 Repository:      https://github.com/storm-software/stryke
 Documentation:   https://stormsoftware.com/projects/stryke/docs
 Contact:         https://stormsoftware.com/contact
 License:         https://stormsoftware.com/projects/stryke/license

 -------------------------------------------------------------------*/

import { constants, copyFileSync, cpSync, type CopySyncOptions } from "node:fs";

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
  options?: CopySyncOptions,
) => {
  cpSync(from, to, options);
};

/**
 * Copy a file from one location to another
 *
 * @param file - The file to copy
 * @param to - The destination location
 * @returns An indicator specifying if the copy was successful
 */
export const copyFile = (file: string, to: string) => {
  copyFileSync(file, to, constants.COPYFILE_FICLONE);
};
