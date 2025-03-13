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

import type path from "node:path";
import { correctPath } from "./correct-path";

/**
 * Join multiple path segments together, resolving '.' and '..' segments, and normalizing the resulting path.
 *
 * @remarks
 * This helper utility performs string joining similar to the `node:path` module's `join` function, and then normalizes the resulting path.
 *
 * @param segments - The path segments to join.
 * @returns The joined path string.
 */
export const joinPaths: typeof path.join = (...segments) => {
  let path = "";

  for (const seg of segments) {
    if (!seg) {
      continue;
    }
    if (path.length > 0) {
      const pathTrailing = path[path.length - 1] === "/";
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

  return correctPath(path);
};
