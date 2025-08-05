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

import { uint8ArrayToString } from "@stryke/convert/uint8-array-to-string";
import { findFolderName, isDirectory, resolveParentPath } from "@stryke/path";
import { joinPaths } from "@stryke/path/join-paths";
import type { GlobOptions } from "glob";
import { createTarGzip } from "nanotar";
import { listFiles } from "./list-files";
import { readFileIfExisting } from "./read-file";
import { writeFile } from "./write-file";

export interface CompressDirectoryOptions extends GlobOptions {
  destination?: string;
}

/**
 * Compress a directory or file into a tar.gz archive.
 *
 * @param directory - The source directory or file/glob to compress.
 * @param options - Options for the compression.
 */
export async function compressDirectory(
  directory: string,
  options?: CompressDirectoryOptions
): Promise<void> {
  const files = await listFiles(
    isDirectory(directory) ? joinPaths(directory, "**/*") : directory,
    options
  );
  const data = await createTarGzip(
    await Promise.all(
      files.map(async file => ({
        name: file,
        data: await readFileIfExisting(file)
      }))
    ),
    {
      attrs: { group: "storm-software" }
    }
  );

  return writeFile(
    options?.destination
      ? isDirectory(options.destination)
        ? joinPaths(options.destination, `${new Date().getTime()}.tar.gz`)
        : options.destination
      : isDirectory(directory)
        ? `${joinPaths(resolveParentPath(directory), findFolderName(directory))}.tar.gz`
        : directory,
    uint8ArrayToString(data)
  );
}
