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
 * A synchronous files and directories listing helper function
 *
 * @param filesGlob - A glob pattern to match files
 * @returns A list of file paths
 */
export function listSync<TOptions extends ListOptions>(
  filesGlob: string,
  options?: TOptions
): InferListReturnType<TOptions> {
  return glob.sync(
    filesGlob,
    defu(options ?? {}, DEFAULT_OPTIONS)
  ) as InferListReturnType<TOptions>;
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
 * A synchronous file listing helper function
 *
 * @param filesGlob - A glob pattern to match files
 * @returns A list of file paths
 */
export function listFilesSync<TOptions extends ListOptions>(
  filesGlob: string,
  options?: TOptions
) {
  const result = listSync(
    filesGlob,
    defu({ withFileTypes: true }, options ?? {}) as GlobOptionsWithFileTypesTrue
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

/**
 * A synchronous directories listing helper function
 *
 * @param filesGlob - A glob pattern to match files
 * @returns A list of file paths
 */
export function listDirectoriesSync<TOptions extends ListOptions>(
  filesGlob: string,
  options?: TOptions
) {
  const result = listSync(
    filesGlob,
    defu({ withFileTypes: true }, options ?? {}) as GlobOptionsWithFileTypesTrue
  ).filter(ret => ret.isDirectory());
  if (!options?.withFileTypes) {
    return result.map(file => file.fullpath()) as InferListReturnType<TOptions>;
  }

  return result as InferListReturnType<TOptions>;
}
