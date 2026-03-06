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

import { toRelativePath, withoutTrailingSlash } from "@stryke/path/normalize";

export interface PrettyPathOptions {
  /**
   * The current working directory to use as the base for the relative path. If not provided, it defaults to `process.cwd()`.
   */
  cwd?: string;

  /**
   * Whether to return a relative path instead of an absolute path.
   *
   * @remarks
   * If `true`, the function will return a path relative to the provided {@link PrettyPathOptions.cwd}.
   *
   * @defaultValue `false`
   */
  relative?: boolean;
}

/**
 * Format a file path to be more human-readable by removing the `file://` prefix and optionally converting it to a relative path.
 *
 * @param path - The file path to format.
 * @param options - Optional settings for how the path should be formatted.
 * @returns A human-readable version of the file path, with the `file://` prefix removed and optionally converted to a relative path based on the provided options.
 */
export function prettyPath(
  path: string,
  options: PrettyPathOptions = {}
): string {
  const formatted = path.replace(/^file:\/\//, "");

  return withoutTrailingSlash(
    options.relative ? toRelativePath(formatted, options.cwd) : formatted
  );
}
