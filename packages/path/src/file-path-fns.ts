/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/license.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://docs.stormsoftware.com/projects/stryke
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import { EMPTY_STRING } from "@stryke/types/base";
import { relative } from "node:path";
import { normalizeString, normalizeWindowsPath } from "./correct-path";
import { getWorkspaceRoot } from "./get-workspace-root";
import { isAbsolutePath } from "./is-file";
import { joinPaths } from "./join-paths";

export interface FindFileNameOptions {
  /**
   * Require the file extension to be present in the file name.
   *
   * @defaultValue false
   */
  requireExtension?: boolean;

  /**
   * Return the file extension as part of the full file name result.
   *
   * @defaultValue true
   */
  withExtension?: boolean;
}

/**
 * Find the file name from a file path.
 *
 * @example
 * ```ts
 * const fileName = findFileName("C:\\Users\\user\\Documents\\file.txt");
 * // fileName = "file.txt"
 * ```
 *
 * @param filePath - The file path to process
 * @param options - Options to control the file name extraction
 * @returns The file name
 */
export function findFileName(
  filePath: string,
  options: FindFileNameOptions = {}
): string {
  const { requireExtension = false, withExtension = true } = options;
  const result =
    normalizeWindowsPath(filePath)
      ?.split(filePath?.includes("\\") ? "\\" : "/")
      ?.pop() ?? "";

  if (requireExtension === true && !result.includes(".")) {
    return EMPTY_STRING;
  }

  if (withExtension === false && result.includes(".")) {
    return result.substring(0, result.lastIndexOf(".")) || EMPTY_STRING;
  }

  return result;
}

/**
 * Find the full file path's directories from a file path.
 *
 * @example
 * ```ts
 * const folderPath = findFilePath("C:\\Users\\user\\Documents\\file.txt");
 * // folderPath = "C:\\Users\\user\\Documents"
 * ```
 *
 * @param filePath - The file path to process
 * @returns The full file path's directories
 */
export function findFilePath(filePath: string): string {
  const normalizedPath = normalizeWindowsPath(filePath);

  const result = normalizedPath.replace(
    findFileName(normalizedPath, { requireExtension: true }),
    ""
  );

  return result === "/" ? result : result.replace(/\/$/, "");
}

/**
 * Find the top most folder containing the file from a file path.
 *
 * @remarks
 * If you're looking for the full path of the folder (for example: `C:\\Users\\user\\Documents` instead of just `Documents`) containing the file, use {@link findFilePath} instead.
 *
 * The functionality of this method is similar to the {@link path.basename} function in Node's path module.
 *
 * @example
 * const folderPath = findFolderName("C:\\Users\\user\\Documents\\file.txt");
 * // folderPath = "Documents"
 *
 * @param filePath - The file path to process
 * @returns The folder containing the file
 */
export function findFolderName(filePath: string): string {
  const segments = findFilePath(filePath).split("/");

  let lastSegment = "";
  for (let i = segments.length - 1; i >= 0; i--) {
    const val = segments[i];
    if (val) {
      lastSegment = val;
      break;
    }
  }

  // if (
  //   folderPath.lastIndexOf("\\") === folderPath.length - 1 ||
  //   folderPath.lastIndexOf("/") === folderPath.length - 1
  // ) {
  //   folderPath = folderPath.slice(0, Math.max(0, folderPath.length - 1));
  // }

  return lastSegment ?? EMPTY_STRING;
}

/**
 * Find the file extension from a file path.
 *
 * @param filePath - The file path to process
 * @returns The file extension or undefined if no extension is found
 */
export function findFileExtension(filePath: string): string | undefined {
  if (filePath.endsWith(".") || filePath.endsWith("/")) {
    return undefined;
  }

  const match = /.(\.[^./]+|\.)$/.exec(normalizeWindowsPath(filePath));

  return (match && match[1]) || undefined;
}

/**
 * Find the file extension from a file path or an empty string.
 *
 * @param filePath - The file path to process
 * @returns The file extension or an empty string if no extension is found
 */
export function findFileExtensionSafe(filePath: string): string {
  return findFileExtension(filePath) ?? EMPTY_STRING;
}

/**
 * Check if a file path has a file name.
 *
 * @param filePath - The file path to process
 * @returns An indicator specifying if the file path has a file name
 */
export function hasFileName(filePath: string): boolean {
  return Boolean(findFileName(filePath));
}

/**
 * Check if a file path has a file path.
 *
 * @param filePath - The file path to process
 * @returns An indicator specifying if the file path has a file path
 */
export function hasFilePath(filePath: string): boolean {
  return Boolean(findFilePath(filePath));
}

/**
 * Check if a file path has a folder name.
 *
 * @param filePath - The file path to process
 * @returns An indicator specifying if the file path has a folder name
 */
export function hasFolderName(filePath: string): boolean {
  return Boolean(findFolderName(filePath));
}

/**
 * Check if a file path has a file extension.
 *
 * @param filePath - The file path to process
 * @returns An indicator specifying if the file path has a file extension
 */
export function hasFileExtension(filePath: string): boolean {
  return Boolean(findFileExtension(filePath));
}

/**
 * Resolve the file path to an absolute path.
 *
 * @param path - The path to resolve
 * @param cwd - The current working directory
 * @returns The resolved path
 */
export function resolvePath(path: string, cwd = getWorkspaceRoot()) {
  // Normalize windows arguments
  const paths = normalizeWindowsPath(path).split("/");

  let resolvedPath = "";
  let resolvedAbsolute = false;

  for (
    let index = paths.length - 1;
    index >= -1 && !resolvedAbsolute;
    index--
  ) {
    const path = index >= 0 ? paths[index] : cwd;

    // Skip empty entries
    if (!path || path.length === 0) {
      continue;
    }

    resolvedPath = joinPaths(path, resolvedPath);
    resolvedAbsolute = isAbsolutePath(path);
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute);

  if (resolvedAbsolute && !isAbsolutePath(resolvedPath)) {
    return `/${resolvedPath}`;
  }

  return resolvedPath.length > 0 ? resolvedPath : ".";
}

/**
 * Resolve the file path to an absolute path.
 *
 * @param paths - The paths to resolve
 * @returns The resolved path
 */
export function resolvePaths(...paths: string[]) {
  return resolvePath(
    joinPaths(...paths.map(path => normalizeWindowsPath(path)))
  );
}

/**
 * Get the relative path from one file to another.
 *
 * @remarks
 * This function wraps the `path.relative` function in Node's path module.
 *
 * @param from - The base path to start from
 * @param to - The target path to resolve relative to the base path
 * @param withEndSlash - Whether to include a trailing slash at the end of the path
 * @returns The relative path from the base path to the target path
 */
export function relativePath(from: string, to: string, withEndSlash = false) {
  return relative(
    withEndSlash !== true ? from.replace(/\/$/, "") : from,
    withEndSlash !== true ? to.replace(/\/$/, "") : to
  );
}

/**
 * Find the file path relative to the workspace root path.
 *
 * @param filePath - The file path to process
 * @returns The resolved file path
 */
export function relativeToWorkspaceRoot(filePath: string) {
  return relativePath(filePath, getWorkspaceRoot());
}

/**
 * Check if the path is a relative path.
 *
 * @param path - The path to check
 * @returns An indicator specifying if the path is a relative path
 */
export function parsePath(path: string) {
  // The root of the path such as '/' or 'c:\'
  const root =
    /^[/\\]|^[a-z]:[/\\]/i.exec(path)?.[0]?.replace(/\\/g, "/") || "";

  const normalizedPath = normalizeWindowsPath(path);

  const segments = normalizedPath.replace(/\/$/, "").split("/").slice(0, -1);
  if (segments.length === 1 && /^[A-Z]:$/i.test(segments[0] as string)) {
    segments[0] += "/";
  }

  const base = findFolderName(normalizedPath);
  const dir = segments.join("/") || (isAbsolutePath(path) ? "/" : ".");
  const ext = findFileExtensionSafe(path);

  return {
    root,
    dir,
    base,
    ext,
    name: base.slice(0, base.length - ext.length)
  };
}

/**
 * Rename the file name with a new name.
 *
 * @param filePath - The current file path being processed
 * @param newFileName - The updated file name being processed
 * @returns The modified or unmodified file path.
 */
export function renameFile(filePath: string, newFileName: string): string {
  const file = parsePath(filePath);

  return joinPaths(
    file.dir,
    newFileName.includes(".") ? newFileName : newFileName + file.ext
  );
}
