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

import type { ListOptions } from "@stryke/fs/list-files";
import { listFiles } from "@stryke/fs/list-files";
import { readFile } from "@stryke/fs/read-file";
import type { HashOptions } from "./hash";
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
      result[file] = await readFile(file);
    })
  );

  return hash(result, options);
}

/**
 * Hash a folder path into a string based on the file content
 *
 * @param directoryPath - The folder path to hash
 * @param  options - Hashing options. By default, the `node_modules`, `.git`, `.nx`, `.cache`, and `tmp` folders is ignored.
 * @returns A hashed string value
 */
export async function hashDirectory(
  directoryPath: string,
  options: HashOptions & ListOptions = {}
): Promise<string> {
  options.ignore = options.ignore ?? [
    "**/node_modules/**",
    "**/.git/**",
    "**/.nx/**",
    "**/.cache/**",
    "**/.storm/**",
    "**/tmp/**"
  ];

  return hashFiles(await listFiles(directoryPath, options), options);
}
