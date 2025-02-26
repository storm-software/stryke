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

import type { HashOptions } from "./hash";
import { statSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { joinPaths } from "@stryke/path/utilities/join-paths";
import { hash } from "./hash";

/**
 * Hash a list of file paths into a string based on the file content
 *
 * @param files - The list of file paths to hash
 * @param  options - Hashing options
 * @returns A hashed string value
 */
export async function hashFiles(
  files: string[],
  options?: HashOptions
): Promise<string> {
  const result = {} as Record<string, string>;
  await Promise.all(
    files.map(async file => {
      result[file] = await readFile(file, "utf8");
    })
  );

  return hash(result, options);
}

/**
 * Hash a folder path into a string based on the file content
 *
 * @param dir - The folder path to hash
 * @param  options - Hashing options
 * @returns A hashed string value
 */
export async function hashDirectory(
  dir: string,
  options?: HashOptions
): Promise<string> {
  const files = [] as string[];
  const getDirContent = async (dir: string) => {
    const dirFiles = await readdir(dir);
    dirFiles.forEach(file => {
      const path = joinPaths(dir, file);
      if (statSync(path).isDirectory()) {
        getDirContent(path);
      } else {
        files.push(path);
      }
    });
  };
  await getDirContent(dir);

  return hashFiles(files, options);
}
