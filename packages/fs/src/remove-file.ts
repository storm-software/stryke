/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/projects/stryke/license.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://stormsoftware.com/projects/stryke/docs
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import { existsSync, rmSync } from "node:fs";
import { rm } from "node:fs/promises";

/**
 * Remove the given content to the given file path
 *
 * @param filePath - The file path to remove to
 */
export const removeFileSync = (filePath: string): void => {
  if (!filePath || !existsSync(filePath)) {
    return;
  }

  rmSync(filePath);
};

/**
 * Remove the given content to the given file path
 *
 * @param filePath - The file path to read to
 */
export const removeFile = async (filePath: string): Promise<void> => {
  if (!filePath || !existsSync(filePath)) {
    return;
  }

  return rm(filePath);
};
