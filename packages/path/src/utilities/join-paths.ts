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

import { normalizePath } from "./normalize-path";

/**
 * Join multiple paths together.
 *
 * @param paths - The paths to join
 * @returns The joined path
 */
export function joinPaths(...paths: string[]): string {
  let path = "";

  for (const seg of paths) {
    if (!seg) {
      continue;
    }
    if (path.length > 0) {
      const pathTrailing = path.at(-1) === "/";
      const segLeading = seg[0] === "/";
      const both = pathTrailing && segLeading;
      if (both) {
        path += seg.slice(1);
      } else {
        path += pathTrailing || segLeading ? seg : `/${seg}`;
      }
    } else {
      path += seg;
    }
  }

  return normalizePath(path);
}
