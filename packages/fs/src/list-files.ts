/* -------------------------------------------------------------------

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

 ------------------------------------------------------------------- */

import { isDirectory } from "@stryke/path/is-file";
import { joinPaths } from "@stryke/path/join-paths";
import { readdir } from "node:fs/promises";
import isMatch from "picomatch";

export interface ListFilesOptions {
  /**
   * A list of directories/files to ignore
   *
   * @defaultValue []
   */
  ignored?: string[];
}

/**
 * The file listing library used by Storm Software for building TypeScript applications.
 *
 * @param directoryPath - The directory path to list files from
 * @returns A list of file paths
 */
export async function listFiles(
  directoryPath: string,
  options: ListFilesOptions = {}
): Promise<string[]> {
  const { ignored = [] } = options;

  const files = [] as string[];
  const innerListFiles = async (dirPath: string) => {
    if (!isMatch(dirPath, ignored)) {
      const fileNames = await readdir(dirPath);
      await Promise.all(
        fileNames.map(async fileName => {
          const filePath = joinPaths(dirPath, fileName);
          if (!isMatch(filePath, ignored)) {
            if (isDirectory(filePath)) {
              await innerListFiles(filePath);
            } else {
              files.push(filePath);
            }
          }
        })
      );
    }
  };
  await innerListFiles(directoryPath);

  return files;
}
