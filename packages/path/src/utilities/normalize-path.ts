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

import { isAbsolutePath } from "./is-file";

/**
 * Replace backslash to slash
 *
 * @param str - The string to replace
 * @returns The string with replaced backslashes
 */
export function slash(str: string) {
  return str.replace(/\\/g, "/");
}

// Util to normalize windows paths to posix
export function normalizeWindowsPath(input = "") {
  if (!input) {
    return input;
  }
  return input
    .replace(/\\/g, "/")
    .replace(/^[A-Z]:\//i, r => r.toUpperCase());
}

/**
 * Constant for path separator.
 *
 * Always equals to `"/"`.
 */
export const sep = "/";

/**
 * Resolves a string path, resolving '.' and '.' segments and allowing paths above the root.
 *
 * @param path - The path to normalize.
 * @param allowAboveRoot - Whether to allow the resulting path to be above the root directory.
 * @returns the normalized path string.
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
          res.at(-1) !== "." ||
          res.at(-2) !== "."
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
 * Normalizes the given path.
 *
 * @remarks
 * Removes duplicate slashes, removes trailing slashes, adds a leading slash.
 *
 * @param path - The path to normalize
 * @returns The normalized path
 */
export function normalizePath(path?: string) {
  if (!path || path.length === 0) {
    return ".";
  }

  // Normalize windows argument
  path = normalizeWindowsPath(path);

  const isUNCPath = path.match(/^[/\\]{2}/);
  const isPathAbsolute = isAbsolutePath(path);
  const trailingSeparator = path.at(-1) === "/";

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
  if (/^[A-Z]:$/i.test(path)) {
    path += "/";
  }

  if (isUNCPath) {
    if (!isPathAbsolute) {
      return `//./${path}`;
    }
    return `//${path}`;
  }

  return isPathAbsolute && !isAbsolutePath(path) ? `/${path}` : path;
}
