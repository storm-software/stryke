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

import { cwd, isParentPath } from "@stryke/path";
import { stripStars } from "@stryke/path/correct-path";
import { findFilePath, hasFileExtension } from "@stryke/path/file-path-fns";
import { joinPaths } from "@stryke/path/join";
import { replacePath } from "@stryke/path/replace";
import { resolveParentPath } from "@stryke/path/resolve-parent-path";
import { isString } from "@stryke/type-checks";
import type { AssetGlob } from "@stryke/types/file";
import { fileURLToPath } from "mlly";
import { copyFileSync as cpfSync } from "node:fs";
import { copyFile as cpf } from "node:fs/promises";
import { existsSync } from "./exists";
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
  const src = source instanceof URL ? fileURLToPath(source) : source;
  const dest =
    destination instanceof URL ? fileURLToPath(destination) : destination;

  if (!hasFileExtension(dest)) {
    if (!existsSync(resolveParentPath(dest))) {
      await createDirectory(resolveParentPath(dest));
    }
  } else if (!existsSync(findFilePath(dest))) {
    await createDirectory(findFilePath(dest));
  }

  if (isString(src) && existsSync(src)) {
    return cpf(src, dest);
  }
}

/**
 * Synchronously copy a file from one location to another
 *
 * @param source - The file to copy, this can be a file, directory, URL, or glob pattern
 * @param destination - The destination location
 * @returns An indicator specifying if the copy was successful
 */
export function copyFileSync(source: string | URL, destination: string | URL) {
  const src = source instanceof URL ? fileURLToPath(source) : source;
  const dest =
    destination instanceof URL ? fileURLToPath(destination) : destination;

  if (!hasFileExtension(dest)) {
    if (!existsSync(resolveParentPath(dest))) {
      createDirectorySync(resolveParentPath(dest));
    }
  } else if (!existsSync(findFilePath(dest))) {
    createDirectorySync(findFilePath(dest));
  }

  if (isString(src) && existsSync(src)) {
    return cpfSync(src, dest);
  }
}

/**
 * Copy files from one location to another
 *
 * @param source - The source location, this can be a file, directory, URL, or glob pattern
 * @param destination - The destination location
 * @returns An indicator specifying if the copy was successful
 */
export async function copyFiles(
  source: string | URL | Omit<AssetGlob, "output">,
  destination: string | URL
) {
  const src = source instanceof URL ? fileURLToPath(source) : source;
  const dest =
    destination instanceof URL ? fileURLToPath(destination) : destination;

  if (isString(src) && isFile(src)) {
    return copyFile(src, dest);
  }

  return Promise.all(
    (await listFiles(src)).map(async entryPath => {
      let sourcePath = (isString(src) ? src : src.input) as string;
      if (!isParentPath(entryPath, sourcePath)) {
        if (isParentPath(entryPath, joinPaths(cwd(), sourcePath))) {
          sourcePath = joinPaths(cwd(), sourcePath);
        }
      }

      const destFile = joinPaths(
        dest,
        stripStars(replacePath(entryPath, sourcePath))
      );

      if (isDirectory(entryPath)) {
        await copyFiles(entryPath, destFile);
      } else {
        await copyFile(entryPath, destFile);
      }
    })
  );
}

/**
 * Synchronously copy files from one location to another
 *
 * @param source - The source location, this can be a file, directory, URL, or glob pattern
 * @param destination - The destination location
 * @returns An indicator specifying if the copy was successful
 */
export function copyFilesSync(
  source: string | URL | Omit<AssetGlob, "output">,
  destination: string | URL
) {
  const src = source instanceof URL ? fileURLToPath(source) : source;
  const dest =
    destination instanceof URL ? fileURLToPath(destination) : destination;

  if (isString(src) && isFile(src)) {
    return copyFileSync(src, dest);
  }

  return listFilesSync(src).map(entryPath => {
    let sourcePath = (isString(src) ? src : src.input) as string;
    if (!isParentPath(entryPath, sourcePath)) {
      if (isParentPath(entryPath, joinPaths(cwd(), sourcePath))) {
        sourcePath = joinPaths(cwd(), sourcePath);
      }
    }

    const destFile = joinPaths(
      dest,
      stripStars(replacePath(entryPath, sourcePath))
    );

    if (isDirectory(entryPath)) {
      copyFilesSync(entryPath, destFile);
    } else {
      copyFileSync(entryPath, destFile);
    }
  });
}
