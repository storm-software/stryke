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

import { readdir } from "node:fs/promises";
import { isDirectory } from "@stryke/path/utilities/is-file";
import { joinPaths } from "@stryke/path/utilities/join-paths";

/**
 * The file listing library used by Storm Software for building TypeScript applications.
 *
 * @param directoryPath - The directory path to list files from
 * @returns A list of file paths
 */
export async function listFiles(directoryPath: string): Promise<string[]> {
  const files = [] as string[];
  const innerListFiles = async (dirPath: string) => {
    const fileNames = await readdir(dirPath);
    await Promise.all(
      fileNames.map(async fileName => {
        const filePath = joinPaths(dirPath, fileName);
        if (isDirectory(filePath)) {
          await innerListFiles(filePath);
        } else {
          files.push(filePath);
        }
      })
    );
  };
  await innerListFiles(directoryPath);

  return files;
}
