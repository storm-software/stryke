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

import { joinPaths } from "@stryke/path/join-paths";
import { lstatSync, statSync } from "node:fs";

/**
 * Check if the given path is a file.
 *
 * @param path - The location to check
 * @param additionalPath - An optional additional path to add to the start of the path
 * @returns An indicator specifying if the path is a file
 */
export function isFile(path: string, additionalPath?: string): boolean {
  return Boolean(
    statSync(additionalPath ? joinPaths(additionalPath, path) : path, {
      throwIfNoEntry: false
    })?.isFile()
  );
}

/**
 * Check if the given path is a directory.
 *
 * @param path - The location to check
 * @param additionalPath - An optional additional path to add to the start of the path
 * @returns An indicator specifying if the path is a directory
 */
export function isDirectory(path: string, additionalPath?: string): boolean {
  return Boolean(
    statSync(additionalPath ? joinPaths(additionalPath, path) : path, {
      throwIfNoEntry: false
    })?.isDirectory()
  );
}

/**
 * Check if the given path is a file . Does not dereference symbolic links.
 *
 * @param path - The location to check
 * @param additionalPath - An optional additional path to add to the start of the path
 * @returns An indicator specifying if the path is a file
 */
export const isFileSymlink = (
  path: string,
  additionalPath?: string
): boolean => {
  return Boolean(
    lstatSync(additionalPath ? joinPaths(additionalPath, path) : path, {
      throwIfNoEntry: false
    })?.isFile()
  );
};

/**
 * Check if the given path is a directory. Does not dereference symbolic links.
 *
 * @param path - The location to check
 * @param additionalPath - An optional additional path to add to the start of the path
 * @returns An indicator specifying if the path is a directory
 */
export const isDirectorySymlink = (
  path: string,
  additionalPath?: string
): boolean => {
  return Boolean(
    lstatSync(additionalPath ? joinPaths(additionalPath, path) : path, {
      throwIfNoEntry: false
    })?.isDirectory()
  );
};
