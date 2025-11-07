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

import { cwd as currentDir } from "./cwd";
import { isAbsolutePath } from "./is-type";
import { joinPaths } from "./join-paths";
import {
  DRIVE_LETTER_REGEX,
  DRIVE_LETTER_START_REGEX,
  UNC_REGEX
} from "./regex";
import { slash } from "./slash";

// Util to normalize windows paths to posix
export function normalizeWindowsPath(input = "") {
  if (!input) {
    return input;
  }

  return slash(input).replace(DRIVE_LETTER_START_REGEX, r => r.toUpperCase());
}

/**
 * Corrects/normalized a file path.
 *
 * @param path - The path to correct.
 * @returns The corrected path.
 */
export function correctPath(path?: string) {
  if (!path || path.length === 0) {
    return ".";
  }

  // Normalize windows argument
  path = normalizeWindowsPath(path);

  const isUNCPath = path.match(UNC_REGEX);
  const isPathAbsolute = isAbsolutePath(path);
  const trailingSeparator = path.endsWith("/");

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

  return !path.startsWith("/") &&
    isPathAbsolute &&
    !DRIVE_LETTER_REGEX.test(path)
    ? `/${path}`
    : path;
}

/**
 * Remove any star tokens (*) from the end of the file path
 *
 * @example
 * stripStars("src/**") // returns "src"
 * stripStars("src/*") // returns "src"
 * stripStars("src/**\/*") // returns "src"
 * stripStars("src/**\/*.txt") // returns "src"
 * stripStars("src/**\/file.txt") // returns "src"
 * stripStars("src/file.txt") // returns "src/file.txt"
 * stripStars("") // returns "."
 *
 * @param path - The path to correct.
 * @returns The corrected path.
 */
export function stripStars(path?: string) {
  if (!path || path.length === 0) {
    return ".";
  }

  path = correctPath(path);

  let found = false;

  return path.split("/").reduce((ret, segment) => {
    if (!segment?.trim()) {
      return ret;
    }

    if (found || segment.includes("*")) {
      found = true;
      return ret;
    }

    return ret + (ret ? `/${segment}` : segment);
  }, "");
}

/**
 * Resolves a string path, resolving '.' and '.' segments and allowing paths above the root.
 *
 * @param path - The path to normalize.
 * @param allowAboveRoot - Whether to allow the resulting path to be above the root directory.
 * @returns the normalize path string.
 */
export function normalizeString(path: string, allowAboveRoot: boolean) {
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

/**
 * Converts a given path to an absolute path based on the current working directory.
 *
 * @param path - The path to convert to an absolute path.
 * @param cwd - The current working directory to use as the base path if the path is not absolute.
 * @returns The absolute path.
 */
export function toAbsolutePath(path: string, cwd?: string): string {
  if (isAbsolutePath(path)) {
    return path;
  }

  return slash(normalizeString(joinPaths(cwd || process.cwd(), path), true));
}

/**
 * Converts a given path to a relative path based on the current working directory.
 *
 * @param path - The path to convert to a relative path.
 * @param cwd - The current working directory to use as the base path if the path is not absolute.
 * @returns The relative path.
 */
export function toRelativePath(path: string, cwd = currentDir()): string {
  if (!path || path.length === 0) {
    return ".";
  }

  if (isAbsolutePath(path)) {
    path = slash(normalizeString(path, true));
  } else {
    path = slash(normalizeString(joinPaths(cwd, path), true));
  }

  if (path.startsWith("./")) {
    return path.slice(2);
  }

  return path;
}

/**
 * Adds a trailing slash to a path if it doesn't already have one.
 *
 * @param path - The path to modify.
 * @returns The modified path with a trailing slash.
 */
export function withTrailingSlash(path: string): string {
  const result = correctPath(path);

  return result.endsWith("/") ? result : `${result}/`;
}
