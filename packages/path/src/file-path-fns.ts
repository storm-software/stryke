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

import { EMPTY_STRING } from "@stryke/types/utility-types/base";
import { getWorkspaceRoot } from "../workspace/get-workspace-root";
import { isAbsolutePath } from "./is-file";
import { joinPaths } from "./join-paths";
import { normalizeString, normalizeWindowsPath } from "./normalize-path";

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
 * @param options - The options to use when processing the file name
 * @returns The file name
 */
export function findFileName(
  filePath: string,
  { requireExtension, withExtension }: FindFileNameOptions = {}
): string {
  const result =
    normalizeWindowsPath(filePath)
      ?.split(filePath?.includes("\\") ? "\\" : "/")
      ?.pop() ?? "";

  if (requireExtension === true && !result.includes(".")) {
    return EMPTY_STRING;
  }

  if (withExtension === false && result.includes(".")) {
    return result.split(".").slice(-1).join(".") || EMPTY_STRING;
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

  return normalizedPath.replace(
    findFileName(normalizedPath, { requireExtension: true }),
    ""
  );
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
 * @returns The file extension
 */
export function findFileExtension(filePath: string): string {
  if (filePath === "..") {
    return "";
  }

  const match = /.(\.[^./]+|\.)$/.exec(normalizeWindowsPath(filePath));

  return (match && match[1]) || EMPTY_STRING;
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

export function relativePath(from: string, to: string) {
  // we cast these because `split` will always be at least one string
  const _from = resolvePath(from)
    .replace(/^\/([A-Z]:)?$/i, "$1")
    .split("/") as [string, ...string[]];
  const _to = resolvePath(to)
    .replace(/^\/([A-Z]:)?$/i, "$1")
    .split("/") as [string, ...string[]];

  // Different windows drive letters
  if (_to[0][1] === ":" && _from[0][1] === ":" && _from[0] !== _to[0]) {
    return _to.join("/");
  }

  const _fromCopy = [..._from];
  for (const segment of _fromCopy) {
    if (_to[0] !== segment) {
      break;
    }
    _from.shift();
    _to.shift();
  }
  return [..._from.map(() => ".."), ..._to].join("/");
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
  const ext = findFileExtension(path);

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
