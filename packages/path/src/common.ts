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

import { correctPath, withoutTrailingSlash } from "./normalize";
import { slash } from "./slash";

/**
 * Get the common path from an array of paths
 *
 * @example
 * ```ts
 * commonPath(['/foo/bar/baz', '/foo/bar/qux', '/foo/bar/baz/quux']);
 * // returns '/foo/bar'
 *
 * commonPath(['C:/foo/bar/baz', 'C:/foo/bar/qux', 'C:/foo/bar/baz/quux']);
 * // returns 'C:/foo/bar'
 * ```
 *
 * @param paths - The array of paths
 * @returns The common path
 */
export function commonPath(paths: string[]): string {
  const [first = "", ...remaining] = paths.map(path =>
    correctPath(slash(path))
  );
  if (!first) {
    return "";
  }
  if (remaining.length === 0) {
    return first;
  }

  let endOfPrefix = first.split("/").length;
  for (const path of remaining) {
    const compare = path.split("/");
    for (let i = 0; i < endOfPrefix; i++) {
      if (compare[i] !== first.split("/")[i]) {
        endOfPrefix = i;
      }
    }

    if (endOfPrefix === 0) {
      return "";
    }
  }

  return withoutTrailingSlash(first.split("/").slice(0, endOfPrefix).join("/"));
}
