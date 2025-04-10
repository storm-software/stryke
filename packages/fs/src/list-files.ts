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

import defu from "defu";
import type { GlobOptions, GlobOptionsWithFileTypesTrue, Path } from "glob";
import { glob } from "glob";

export type ListOptions = GlobOptions;
export type InferListReturnType<TOptions extends GlobOptions> =
  TOptions["withFileTypes"] extends true ? Path[] : string[];

const DEFAULT_OPTIONS: ListOptions = {
  dot: true
};

/**
 * A files and directories listing helper function
 *
 * @param filesGlob - A glob pattern to match files
 * @returns A list of file paths
 */
export async function list<TOptions extends ListOptions>(
  filesGlob: string,
  options?: TOptions
): Promise<InferListReturnType<TOptions>> {
  return glob(filesGlob, defu(options ?? {}, DEFAULT_OPTIONS)) as Promise<
    InferListReturnType<TOptions>
  >;
}

/**
 * A file listing helper function
 *
 * @param filesGlob - A glob pattern to match files
 * @returns A list of file paths
 */
export async function listFiles<TOptions extends ListOptions>(
  filesGlob: string,
  options?: TOptions
) {
  const result = (
    await list(
      filesGlob,
      defu(
        { withFileTypes: true },
        options ?? {}
      ) as GlobOptionsWithFileTypesTrue
    )
  ).filter(ret => ret.isFile());
  if (!options?.withFileTypes) {
    return result.map(file => file.fullpath()) as InferListReturnType<TOptions>;
  }

  return result as InferListReturnType<TOptions>;
}

/**
 * A directories listing helper function
 *
 * @param filesGlob - A glob pattern to match files
 * @returns A list of file paths
 */
export async function listDirectories<TOptions extends ListOptions>(
  filesGlob: string,
  options?: TOptions
) {
  const result = (
    await list(
      filesGlob,
      defu(
        { withFileTypes: true },
        options ?? {}
      ) as GlobOptionsWithFileTypesTrue
    )
  ).filter(ret => ret.isDirectory());
  if (!options?.withFileTypes) {
    return result.map(file => file.fullpath()) as InferListReturnType<TOptions>;
  }

  return result as InferListReturnType<TOptions>;
}
