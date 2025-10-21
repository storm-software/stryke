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

import { existsSync, readFileSync as readFileSyncFs } from "node:fs";
import { readFile as readFileFs } from "node:fs/promises";

/**
 * Read the given content to the given file path
 *
 * @param filePath - The file path to write to
 */
export const readFileSync = (filePath: string): string => {
  if (!filePath) {
    throw new Error("No file path provided to read data");
  }

  return readFileSyncFs(filePath, { encoding: "utf8" });
};

/**
 * Read the given content to the given file path
 *
 * @param filePath - The file path to read to
 */
export const readFile = async (filePath: string): Promise<string> => {
  if (!filePath) {
    throw new Error("No file path provided to read data");
  }

  return readFileFs(filePath, { encoding: "utf8" });
};

/**
 * Reads a file if it exists, otherwise returns an empty string.
 *
 * @param path - The path to the file to read.
 * @returns The content of the file if it exists, otherwise an empty string.
 */
export function readFileIfExistingSync(path: string) {
  return existsSync(path) ? readFileSync(path) : "";
}

/**
 * Reads a file if it exists, otherwise returns an empty string.
 *
 * @param path - The path to the file to read.
 * @returns The content of the file if it exists, otherwise an empty string.
 */
export async function readFileIfExisting(path: string) {
  return existsSync(path) ? readFile(path) : "";
}
