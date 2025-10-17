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

import { joinPaths } from "@stryke/path";
import { fileURLToPath } from "mlly";
import { copyFileSync as cpfSync } from "node:fs";
import { copyFile as cpf } from "node:fs/promises";
import { createDirectory, createDirectorySync } from "./helpers";
import { isDirectory, isFile } from "./is-file";
import { listFiles, listFilesSync } from "./list-files";

/**
 * Copy a file from one location to another
 *
 * @param source - The file to copy, this can be a file, directory, URL, or glob pattern
 * @param destination - The destination location
 * @returns An indicator specifying if the copy was successful
 */
export async function copyFile(
  source: string | URL,
  destination: string | URL
) {
  return cpf(source, destination);
}

/**
 * Synchronously copy a file from one location to another
 *
 * @param source - The file to copy, this can be a file, directory, URL, or glob pattern
 * @param destination - The destination location
 * @returns An indicator specifying if the copy was successful
 */
export function copyFileSync(source: string | URL, destination: string | URL) {
  return cpfSync(source, destination);
}

/**
 * Copy files from one location to another
 *
 * @param source - The source location, this can be a file, directory, URL, or glob pattern
 * @param destination - The destination location
 * @returns An indicator specifying if the copy was successful
 */
export async function copyFiles(
  source: string | URL,
  destination: string | URL
) {
  const src = source instanceof URL ? fileURLToPath(source) : source;
  const dest =
    destination instanceof URL ? fileURLToPath(destination) : destination;

  if (isFile(src)) {
    return copyFile(src, dest);
  }

  await createDirectory(dest);
  return Promise.all(
    (await listFiles(src.includes("*") ? src : joinPaths(src, "**", "*"))).map(
      async entryPath => {
        const fromEntryPath = joinPaths(src, entryPath);
        const toEntryPath = joinPaths(dest, entryPath);

        if (isDirectory(entryPath)) {
          await copyFiles(fromEntryPath, toEntryPath);
        } else {
          await copyFile(fromEntryPath, toEntryPath);
        }
      }
    )
  );
}

/**
 * Synchronously copy files from one location to another
 *
 * @param source - The source location, this can be a file, directory, URL, or glob pattern
 * @param destination - The destination location
 * @returns An indicator specifying if the copy was successful
 */
export function copyFilesSync(source: string | URL, destination: string | URL) {
  const src = source instanceof URL ? fileURLToPath(source) : source;
  const dest =
    destination instanceof URL ? fileURLToPath(destination) : destination;

  if (isFile(src)) {
    return copyFileSync(src, dest);
  }

  createDirectorySync(dest);
  return listFilesSync(src.includes("*") ? src : joinPaths(src, "**", "*")).map(
    entryPath => {
      const fromEntryPath = joinPaths(src, entryPath);
      const toEntryPath = joinPaths(dest, entryPath);

      if (isDirectory(entryPath)) {
        copyFilesSync(fromEntryPath, toEntryPath);
      } else {
        copyFileSync(fromEntryPath, toEntryPath);
      }
    }
  );
}
