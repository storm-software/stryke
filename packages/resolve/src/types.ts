/* -------------------------------------------------------------------

                       🗲 Storm Software - Stryke

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

import type { ResolveOptions as FSResolveOptions } from "@stryke/fs/resolve";
import type { DeepPartial } from "@stryke/types/base";
import type { FileReference } from "@stryke/types/configuration";
import type { URLString } from "@stryke/url/types";
import type { BuildOptions } from "esbuild";

/**
 * A type that represents a GitHub repository reference string.
 *
 * @remarks
 * A GitHub repository reference string, starting with either `"github:"` or `"gh:"`, an optional branch or tag, and optionally including a specific file path within the repository (for example: `"github:main:storm-software/stryke/packages/url/src/types.ts"`). It is also valid to provide the branch or tag after the file path (for example: `"github:storm-software/stryke/packages/url/src/types.ts@main"`).
 */
export type GitHubReference = `github:${string}` | `gh:${string}`;

/**
 * A type that represents a GitLab repository reference string.
 *
 * @remarks
 * A GitLab repository reference string, starting with either `"gitlab:"` or `"gl:"`, an optional branch or tag, and optionally including a specific file path within the repository (for example: `"gitlab:master:storm-software/stryke/packages/url/src/types.ts"`). It is also valid to provide the branch or tag after the file path (for example: `"gitlab:storm-software/stryke/packages/url/src/types.ts@master"`).
 */
export type GitLabReference = `gitlab:${string}` | `gl:${string}`;

/**
 * A type that represents a URL reference, which can be a URL string reference, a GitHub repository reference, or a GitLab repository reference.
 *
 * @remarks
 * A `URLReference` can be one of the following shapes:
 * - A {@link URLString}, which is a string that represents a valid URL format.
 * - A {@link GitHubReference}, which is a string that represents a GitHub repository reference.
 * - A {@link GitLabReference}, which is a string that represents a GitLab repository reference.
 */
export type URLReference = URLString | GitHubReference | GitLabReference;

/**
 * A type that represents the input for resolving a file reference.
 *
 * @remarks
 * The `ResolveInput` type can be one of the following variants:
 * - A file path string (for example: `"./src/types.ts"`).
 * - A {@link URLString | URL string} (for example: `"https://example.com/config.json"`).
 * - A {@link GitHubReference | GitHub repository reference string}, starting with either `"github:"` or `"gh:"`, an optional branch or tag, and optionally including a specific file path within the repository (for example: `"github:main:storm-software/stryke/packages/base/resolve/src/types.ts"`). It is also valid to provide the branch or tag after the file path (for example: `"github:storm-software/stryke/packages/resolve/src/types.ts@main"`).
 * - A {@link GitLabReference | GitLab repository reference string}, starting with either `"gitlab:"` or `"gl:"`, an optional branch or tag, and optionally including a specific file path within the repository (for example: `"gitlab:master:storm-software/stryke/packages/resolve/src/types.ts"`). It is also valid to provide the branch or tag after the file path (for example: `"gitlab:storm-software/stryke/packages/resolve/src/types.ts@master"`).
 * - A TypeScript module name string (for example: `"@stryke/resolve"`), and optionally a specific module export from the package (for example: `"@stryke/resolve/some-module"`).
 * - A {@link URL} object, which represents a URL to fetch the file from.
 */
export type ResolveInput = string | URLReference | URL;

export interface BaseResolveOptions extends BundleOptions {
  /**
   * The file extension to use when resolving the file reference.
   */
  extension?: string;

  /**
   * Whether to skip the bundling step when resolving the file reference.
   *
   * @defaultValue false
   * @remarks
   * If set to `true`, the bundling step will be skipped, and the file reference will be resolved directly without bundling. This can be useful when you want to resolve a file reference without modifying its contents or when you want to avoid the overhead of bundling.
   */
  skipBundle?: boolean;
}

export interface URLResolveOptions extends BaseResolveOptions {
  fetch?: (
    input: string | URL | Request,
    init?: RequestInit
  ) => Promise<Response>;
  headers?: Record<string, string>;
}

export type BundleOptions = DeepPartial<
  Omit<
    BuildOptions,
    | "entryPoints"
    | "write"
    | "stdin"
    | "sourcemap"
    | "sourceRoot"
    | "sourcefile"
    | "sourcesContent"
    | "splitting"
    | "treeShaking"
    | "bundle"
    | "packages"
    | "keepNames"
    | "metafile"
    | "outfile"
    | "outdir"
    | "outbase"
    | "outExtension"
    | "banner"
    | "footer"
    | "inject"
    | "define"
    | "legalComments"
    | "allowOverwrite"
    | "publicPath"
    | "entryNames"
    | "chunkNames"
    | "assetNames"
    | "absWorkingDir"
    | "absPaths"
    | "lineLimit"
    | "color"
    | "logLevel"
    | "logLimit"
    | "logOverride"
  >
> & {
  /**
   * The current working directory to use for resolving entry points and other file paths.
   *
   * @defaultValue `process.cwd()`
   */
  cwd?: string;
};

export type FilePathResolveOptions = BaseResolveOptions & FSResolveOptions;

export type InferResolveOptions<T extends ResolveInput> = T extends URLReference
  ? URLResolveOptions
  : T extends URL
    ? URLResolveOptions
    : T extends string
      ? FilePathResolveOptions
      : never;

/**
 * A type that represents the input for loading a file reference.
 *
 * @remarks
 * The `LoadInput` type can be one of the following variants:
 * - A file path string (for example: `"./src/types.ts"`).
 * - A URL string (for example: `"https://example.com/config.json"`).
 * - A {@link GitHubReference | GitHub repository reference string}, starting with either `"github:"` or `"gh:"`, an optional branch or tag, and optionally including a specific file path within the repository (for example: `"github:main:storm-software/stryke/packages/resolve/src/types.ts"`). It is also valid to provide the branch or tag after the file path (for example: `"github:storm-software/stryke/packages/resolve/src/types.ts@main"`).
 * - A {@link GitLabReference | GitLab repository reference string}, starting with either `"gitlab:"` or `"gl:"`, an optional branch or tag, and optionally including a specific file path within the repository (for example: `"gitlab:master:storm-software/stryke/packages/resolve/src/types.ts"`). It is also valid to provide the branch or tag after the file path (for example: `"gitlab:storm-software/stryke/packages/resolve/src/types.ts@master"`).
 * - A TypeScript module name string (for example: `"@stryke/resolve"`), and optionally a specific module export from the package (for example: `"@stryke/resolve/some-module"`).
 * - A file reference string (this value can include both a path to the TypeScript module and the name of the module export separated by a ":", "#", or ";" character - for example: `"./src/types.ts#ExampleExport"`).
 * - A {@link FileReference} object, which contains information about a file reference.
 * - A {@link URL} object, which represents a URL to fetch the file from.
 */
export type LoadInput = ResolveInput | FileReference;

export type InferLoadOptions<T extends LoadInput> = InferResolveOptions<
  T extends FileReference ? T["file"] : T
> & {
  /**
   * Whether to enable extended logging for the load operation.
   */
  debug?: boolean;
};
