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

import { existsSync, rmSync } from "node:fs";
import { rm } from "node:fs/promises";

/**
 * Remove the given content to the given file path
 *
 * @param filePath - The file path to remove to
 * @param content - The content to remove to the file
 */
export const removeFileSync = (filePath: string): void => {
  if (!filePath || !existsSync(filePath)) {
    throw new Error("Invalid file path provided to remove data");
  }

  rmSync(filePath);
};

/**
 * Remove the given content to the given file path
 *
 * @param filePath - The file path to read to
 * @param content - The content to remove to the file
 * @returns The content of the file
 */
export const removeFile = (filePath: string): Promise<void> => {
  if (!filePath || !existsSync(filePath)) {
    throw new Error("Invalid file path provided to remove data");
  }

  return rm(filePath);
};
