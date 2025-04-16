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

import { lstatSync, statSync } from "node:fs";
import { joinPaths } from "./join-paths";
import { ABSOLUTE_PATH_REGEX } from "./regex";
import { slash } from "./slash";

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

/**
 * Check if the path is an absolute path.
 *
 * @param path - The path to check
 * @returns An indicator specifying if the path is an absolute path
 */
export function isAbsolutePath(path: string): boolean {
  return ABSOLUTE_PATH_REGEX.test(slash(path));
}

/**
 * Check if the path is a relative path.
 *
 * @param path - The path to check
 * @returns An indicator specifying if the path is a relative path
 */
export function isRelativePath(path: string): boolean {
  return !isAbsolutePath(path);
}
