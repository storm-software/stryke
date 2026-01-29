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

import { isAbsolute } from "./is-type";
import {
  DRIVE_LETTER_REGEX,
  DRIVE_LETTER_START_REGEX,
  UNC_REGEX
} from "./regex";
import { slash } from "./slash";

// Util to normalize windows paths to posix
function normalizeWindowsPath(input = "") {
  if (!input) {
    return input;
  }
  return input
    .replace(/\\/g, "/")
    .replace(DRIVE_LETTER_START_REGEX, r => r.toUpperCase());
}

function correctPaths(path?: string) {
  if (!path || path.length === 0) {
    return ".";
  }

  // Normalize windows argument
  path = normalizeWindowsPath(path);

  const isUNCPath = path.match(UNC_REGEX);
  const isPathAbsolute = isAbsolute(path);
  const trailingSeparator = path[path.length - 1] === "/";

  // Normalize the path
  path = normalizeString(path, !isPathAbsolute);

  if (path.length === 0) {
    if (isPathAbsolute) {
      return "/";
    }
    return trailingSeparator ? "./" : ".";
  }
  if (trailingSeparator) {
    path += "/";
  }
  if (DRIVE_LETTER_REGEX.test(path)) {
    path += "/";
  }

  if (isUNCPath) {
    if (!isPathAbsolute) {
      return `//./${path}`;
    }
    return `//${path}`;
  }

  return isPathAbsolute && !isAbsolute(path) ? `/${path}` : path;
}

/**
 * Joins all given path segments together using the platform-specific separator as a delimiter.
 *
 * @remarks
 * Multiple segments can be provided as separate arguments. The resulting path is normalized to remove any redundant or unnecessary segments.
 *
 * @example
 * ```ts
 * import { joinPaths } from 'stryke/path';
 *
 * const fullPath = joinPaths('folder1', 'folder2', '..', 'folder3', 'file.txt');
 * console.log(fullPath); // Output: 'folder1/folder3/file.txt'
 *
 * const absolutePath = joinPaths('/root', 'folder', '.', 'subfolder', 'file.txt');
 * console.log(absolutePath); // Output: '/root/folder/subfolder/file.txt'
 *
 * const windowsPath = joinPaths('C:\\', 'Users', 'Public', '..', 'Documents', 'file.txt');
 * console.log(windowsPath); // Output: 'C:/Users/Documents/file.txt'
 *
 * const uncPath = joinPaths('\\\\Server\\Share', 'Folder', 'File.txt');
 * console.log(uncPath); // Output: '//Server/Share/Folder/File.txt'
 * ```
 *
 * @param segments - The path segments to join.
 * @returns The joined and normalized path string.
 */
export function joinPaths(...segments: string[]): string {
  let result = "";
  for (const segment of segments) {
    if (segment) {
      if (result.length > 0) {
        if (slash(segment).replaceAll(/\//g, "") === "..") {
          result = slash(result)
            .replace(/\/+$/, "")
            .replace(/\/*[^/]+$/, "");
        } else {
          result = `${slash(result).replace(/\/+$/, "")}/${slash(
            segment
          ).replace(/^\/+/, "")}`;
        }
      } else if (slash(segment).replaceAll(/\//g, "") !== "..") {
        result = segment;
      }
    }
  }

  return correctPaths(result);
}

export const join = joinPaths;

/**
 * Resolves a string path, resolving '.' and '.' segments and allowing paths above the root.
 *
 * @param path - The path to normalize.
 * @param allowAboveRoot - Whether to allow the resulting path to be above the root directory.
 * @returns the normalized path string.
 */
function normalizeString(path: string, allowAboveRoot: boolean) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char: string | null = null;
  for (let index = 0; index <= path.length; ++index) {
    if (index < path.length) {
      // casted because we know it exists thanks to the length check
      char = path[index] as string;
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) {
        // NOOP
      } else if (dots === 2) {
        if (
          res.length < 2 ||
          lastSegmentLength !== 2 ||
          res[res.length - 1] !== "." ||
          res[res.length - 2] !== "."
        ) {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path.slice(lastSlash + 1, index)}`;
        } else {
          res = path.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
