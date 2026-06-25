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

import type { OutputFile } from "esbuild";
import { build } from "esbuild";
import { existsSync } from "node:fs";
import type { BundleOptions } from "./types";

/**
 * Bundle a type definition to a module.
 *
 * @param file - The file path to bundle.
 * @param options - Optional overrides for the ESBuild configuration.
 * @returns A promise that resolves to the bundled module.
 */
export async function bundle(
  file: string,
  options: BundleOptions = {}
): Promise<OutputFile> {
  if (!file || !existsSync(file)) {
    throw new Error(
      `Module not found: "${file}". Please check the path and try again.`
    );
  }

  const result = await build({
    platform: "node",
    format: "esm",
    ...options,
    logLevel: "silent",
    entryPoints: [file],
    write: false,
    sourcemap: false,
    splitting: false,
    treeShaking: true,
    bundle: true,
    packages: "bundle",
    keepNames: true,
    metafile: false
  });
  if (result.errors.length > 0) {
    throw new Error(
      `Failed to bundle ${file}: ${result.errors
        .map(error => error.text)
        .join(", ")}`
    );
  }

  if (!result.outputFiles || result.outputFiles.filter(Boolean).length === 0) {
    throw new Error(
      `No output files generated for ${
        file
      }. Please check the configuration and try again.`
    );
  }

  return result.outputFiles.filter(Boolean)[0]!;
}
