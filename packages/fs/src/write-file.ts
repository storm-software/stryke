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

import { correctPath } from "@stryke/path/correct-path";
import { findFilePath } from "@stryke/path/file-path-fns";
import type { Abortable } from "node:events";
import type {
  WriteFileOptions as FSWriteFileOptions,
  Mode,
  ObjectEncodingOptions,
  OpenMode
} from "node:fs";
import { writeFileSync as writeFileSyncFs } from "node:fs";
import { writeFile as writeFileFs } from "node:fs/promises";
import type { Encoding } from "./constants";
import { existsSync } from "./exists";
import { createDirectory, createDirectorySync } from "./helpers";

export interface WriteFileOptions {
  /**
   * Whether to create the directory if it does not exist
   *
   * @defaultValue true
   */
  createDirectory?: boolean;
}

/**
 * Write the given content to the given file path
 *
 * @param filePath - The file path to write to
 * @param content - The content to write to the file
 */
export const writeFileSync = (
  filePath: string,
  content = "",
  options: WriteFileOptions & FSWriteFileOptions = {}
): void => {
  if (!filePath) {
    throw new Error("No file path provided to write data");
  }

  const directory = findFilePath(correctPath(filePath));
  if (!existsSync(directory)) {
    if (options.createDirectory !== false) {
      createDirectorySync(directory);
    } else {
      throw new Error(`Directory ${directory} does not exist`);
    }
  }

  writeFileSyncFs(filePath, content || "", options);
};

/**
 * Read the given content to the given file path
 *
 * @param filePath - The file path to read to
 * @param content - The content to write to the file
 * @returns The content of the file
 */
export const writeFile = async (
  filePath: string,
  content = "",
  options: WriteFileOptions &
    (
      | (ObjectEncodingOptions & {
          mode?: Mode | undefined;
          flag?: OpenMode | undefined;
          flush?: boolean | undefined;
        } & Abortable)
      | Encoding
    ) = {}
): Promise<void> => {
  if (!filePath) {
    throw new Error("No file path provided to read data");
  }

  const directory = findFilePath(correctPath(filePath));
  if (!existsSync(directory)) {
    if (options.createDirectory !== false) {
      await createDirectory(directory);
    } else {
      throw new Error(`Directory ${directory} does not exist`);
    }
  }

  return writeFileFs(filePath, content || "", options);
};
