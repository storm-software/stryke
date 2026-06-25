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

import type { DeepPartial } from "@stryke/types/base";
import type { FileReference } from "@stryke/types/configuration";
import type { GitHubReference, GitLabReference } from "@stryke/url/types";
import type { BuildOptions } from "esbuild";

/**
 * A type that represents the input for resolving a file reference.
 *
 * @remarks
 * The `ResolveInput` type can be one of the following variants:
 * - A file path string (for example: `"./src/types.ts"`).
 * - A URL string (for example: `"https://example.com/config.json"`).
 * - A GitHub repository reference string, starting with either `"github:"` or `"gh:"`, an optional branch or tag, and optionally including a specific file path within the repository (for example: `"github:main:storm-software/stryke/packages/base/resolve/src/types.ts"`). It is also valid to provide the branch or tag after the file path (for example: `"github:storm-software/stryke/packages/resolve/src/types.ts@main"`).
 * - A GitLab repository reference string, starting with either `"gitlab:"` or `"gl:"`, an optional branch or tag, and optionally including a specific file path within the repository (for example: `"gitlab:master:storm-software/stryke/packages/resolve/src/types.ts"`). It is also valid to provide the branch or tag after the file path (for example: `"gitlab:storm-software/stryke/packages/resolve/src/types.ts@master"`).
 * - A TypeScript module name string (for example: `"@stryke/resolve"`), and optionally a specific module export from the package (for example: `"@stryke/resolve/some-module"`).
 * - A {@link URL} object, which represents a URL to fetch the file from.
 */
export type ResolveInput = string | GitHubReference | GitLabReference | URL;

export interface ResolveOptions {
  cwd?: string;
  fetch?: (
    input: string | URL | Request,
    init?: RequestInit
  ) => Promise<Response>;
  headers?: Record<string, string>;
  extension?: string;
}

/**
 * A type that represents the input for loading a file reference.
 *
 * @remarks
 * The `LoadInput` type can be one of the following variants:
 * - A file path string (for example: `"./src/types.ts"`).
 * - A URL string (for example: `"https://example.com/config.json"`).
 * - A GitHub repository reference string, starting with either `"github:"` or `"gh:"`, an optional branch or tag, and optionally including a specific file path within the repository (for example: `"github:main:storm-software/stryke/packages/resolve/src/types.ts"`). It is also valid to provide the branch or tag after the file path (for example: `"github:storm-software/stryke/packages/resolve/src/types.ts@main"`).
 * - A GitLab repository reference string, starting with either `"gitlab:"` or `"gl:"`, an optional branch or tag, and optionally including a specific file path within the repository (for example: `"gitlab:master:storm-software/stryke/packages/resolve/src/types.ts"`). It is also valid to provide the branch or tag after the file path (for example: `"gitlab:storm-software/stryke/packages/resolve/src/types.ts@master"`).
 * - A TypeScript module name string (for example: `"@stryke/resolve"`), and optionally a specific module export from the package (for example: `"@stryke/resolve/some-module"`).
 * - A file reference string (this value can include both a path to the TypeScript module and the name of the module export separated by a ":", "#", or ";" character - for example: `"./src/types.ts#ExampleExport"`).
 * - A {@link FileReference} object, which contains information about a file reference.
 * - A {@link URL} object, which represents a URL to fetch the file from.
 */
export type LoadInput = ResolveInput | FileReference;

export type BundleOptions = DeepPartial<
  Omit<
    BuildOptions,
    | "logLevel"
    | "entryPoints"
    | "write"
    | "sourcemap"
    | "splitting"
    | "treeShaking"
    | "bundle"
    | "packages"
    | "keepNames"
    | "metafile"
    | "outfile"
    | "outdir"
    | "allowOverwrite"
    | "outbase"
  >
>;
