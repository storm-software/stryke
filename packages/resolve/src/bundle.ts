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

import { resolve as resolveFilePath } from "@stryke/fs/resolve";
import { omit } from "@stryke/helpers/omit";
import { findFileExtensionSafe } from "@stryke/path/find";
import { isRelativePath } from "@stryke/path/is-type";
import { joinPaths } from "@stryke/path/join-paths";
import { isURL } from "@stryke/type-checks/is-url";
import { isURLString, isValidURL } from "@stryke/url/helpers";
import defu from "defu";
import type { Loader, OutputFile, Plugin } from "esbuild";
import { build } from "esbuild";
import { extractGitHubReference, extractGitLabReference } from "./helpers";
import { resolve } from "./resolve";
import { isGitHubReference, isGitLabReference } from "./type-checks";
import type { BundleOptions, ResolveReference } from "./types";

export function plugin(
  options: BundleOptions & { originalInput: ResolveReference }
): Plugin {
  const isLocalFile =
    !isURL(options.originalInput) &&
    !isURLString(options.originalInput) &&
    !isGitHubReference(options.originalInput) &&
    !isGitLabReference(options.originalInput);

  return {
    name: "stryke",
    setup(build) {
      build.onResolve({ filter: /.*/ }, async args => {
        let path = args.path;
        if (isLocalFile) {
          path = await resolveFilePath(
            path,
            defu(options.fs ?? {}, {
              paths: [options.cwd, args.resolveDir, args.importer].filter(
                Boolean
              ) as string[],
              extensions: options.resolveExtensions,
              conditions: options.conditions
            })
          );
        } else if (isRelativePath(path)) {
          if (
            isURL(options.originalInput) ||
            isURLString(options.originalInput)
          ) {
            path = new URL(
              path,
              isValidURL(args.importer)
                ? args.importer
                : options.originalInput.toString()
            ).href;
          } else if (isGitHubReference(options.originalInput)) {
            const { owner, repo, branch, filePath } = extractGitHubReference(
              isGitHubReference(args.importer)
                ? args.importer
                : options.originalInput
            );
            const directory = filePath?.includes("/")
              ? filePath.slice(0, filePath.lastIndexOf("/"))
              : "";

            path = `github:${owner}/${repo}/${joinPaths(directory, path)}@${branch}`;
          } else if (isGitLabReference(options.originalInput)) {
            const { owner, repo, branch, filePath } = extractGitLabReference(
              isGitLabReference(args.importer)
                ? args.importer
                : options.originalInput
            );
            const directory = filePath?.includes("/")
              ? filePath.slice(0, filePath.lastIndexOf("/"))
              : "";

            path = `gitlab:${owner}/${repo}/${joinPaths(directory, path)}@${branch}`;
          }
        } else {
          return;
        }

        return { path, namespace: !options.fs ? "stryke" : undefined };
      });

      build.onLoad(
        { filter: /.*/, namespace: !options.fs ? "stryke" : undefined },
        async args => {
          const contents = await resolve(args.path, {
            ...options,
            skipBundle: true
          });

          return {
            contents,
            loader: (findFileExtensionSafe(args.path) || "ts") as Loader
          };
        }
      );
    }
  };
}

/**
 * Bundle a type definition to a module.
 *
 * @param file - The file path to bundle.
 * @param options - Optional overrides for the ESBuild configuration.
 * @returns A promise that resolves to the bundled module.
 */
export async function bundle(
  contents: string,
  options: BundleOptions & { originalInput?: ResolveReference } = {}
): Promise<OutputFile> {
  if (!options.originalInput) {
    throw new Error(
      "The 'originalInput' option is required for bundling. Please provide the original input to resolve."
    );
  }

  const result = await build({
    platform: "node",
    format: "esm",
    ...omit(options, ["cwd", "fs", "originalInput"]),
    logLevel: "silent",
    stdin: {
      contents
    },
    write: false,
    sourcemap: false,
    splitting: false,
    treeShaking: true,
    bundle: true,
    packages: "bundle",
    keepNames: true,
    metafile: false,
    absWorkingDir: options.cwd,
    plugins: [plugin({ ...options, originalInput: options.originalInput })]
  });
  if (result.errors.length > 0) {
    throw new Error(
      `Failed to bundle ${String(options.originalInput)}: ${result.errors
        .map(error => error.text)
        .join(", ")}`
    );
  }

  if (!result.outputFiles || result.outputFiles.filter(Boolean).length === 0) {
    throw new Error(
      `No output files generated for ${String(
        options.originalInput
      )}. Please check the configuration and try again.`
    );
  }

  return result.outputFiles.filter(Boolean)[0]!;
}
