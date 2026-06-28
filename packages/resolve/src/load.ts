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

import { extractFileReference } from "@stryke/convert/extract-file-reference";
import { omit } from "@stryke/helpers/omit";
import {
  findFileDotExtensionSafe,
  findFileExtensionSafe,
  findFileName
} from "@stryke/path/find";
import { joinPaths } from "@stryke/path/join";
import { isURL } from "@stryke/type-checks/is-url";
import { isValidURL } from "@stryke/url/helpers";
import { createJiti } from "jiti";
import { parse as parseToml } from "smol-toml";
import { parseFilename } from "ufo";
import { parse as parseYaml } from "yaml";
import { resolve } from "./resolve";
import { isURLReference } from "./type-checks";
import type { InferLoadOptions, LoadReference } from "./types";

/**
 * Loads a file from the specified input, which can be a string, a {@link FileReference} object, or a {@link URL} object. The function resolves the file reference and returns the content of the file as a string.
 *
 * @remarks
 * The input can be:
 * - A string representing the file path or URL.
 * - A {@link FileReference} object, which contains a `file` property specifying the file path and an optional `exportName` property for named exports.
 * - A {@link URL} object, which represents a URL to fetch the file from.
 *
 * The function also accepts optional overrides for the file resolution process through the `options` parameter.
 *
 * @param reference - The file reference to load. This can be either a string, a {@link FileReference} object, or a {@link URL} object.
 * @param options - Optional overrides for the file resolution process.
 * @returns A promise that resolves to the content of the file as a string.
 */
export async function load<TResult>(
  reference: LoadReference,
  options: InferLoadOptions<typeof reference> = {}
): Promise<TResult> {
  const fileReference = extractFileReference(
    isURL(reference) ? reference.toString() : reference
  );
  if (!fileReference) {
    throw new Error(
      `Failed to extract a file reference from the provided input. The input must be a string or an object with a "file" property that specifies the file path and optional export name.`
    );
  }

  const content = await resolve(fileReference.file, omit(options, ["debug"]));

  const extension = findFileExtensionSafe(fileReference.file);
  if (extension.startsWith("json")) {
    // Parse JSON files directly without bundling, as they are already in a compatible format.
    return JSON.parse(content) as TResult;
  } else if (extension === "yaml" || extension === "yml") {
    // Parse YAML files directly without bundling, as they are already in a compatible format.
    return parseYaml(content) as TResult;
  } else if (extension === "toml") {
    // Parse TOML files directly without bundling, as they are already in a compatible format.
    return parseToml(content) as TResult;
  }

  let resolved: any;
  try {
    const filename = isURLReference(fileReference.file)
      ? joinPaths(
          options?.cwd ?? process.cwd(),
          (isValidURL(fileReference.file)
            ? parseFilename(fileReference.file)
            : findFileName(
                fileReference.file.includes(":")
                  ? fileReference.file.slice(
                      fileReference.file.lastIndexOf(":") + 1
                    )
                  : fileReference.file
              )) || "module.js"
        )
      : fileReference.file;

    const jiti = createJiti(options?.cwd ?? process.cwd());
    resolved = await jiti.evalModule(content, {
      filename,
      ext: findFileDotExtensionSafe(filename)
    });
  } catch (error) {
    throw new Error(
      `Failed to evaluate the bundled module for "${
        fileReference.file
      }". Error: ${(error as Error).message}${
        options.debug
          ? `\n\nBundle output for module: \n${
              content && content.length > 50_000
                ? `${content.slice(0, 50_000)}\n... [truncated]`
                : content
            }`
          : ""
      }`
    );
  }

  const result =
    resolved[fileReference.export ?? "default"] ??
    resolved[`__Ω${fileReference.export ?? "default"}`];
  if (result === undefined) {
    throw new Error(
      `The export "${fileReference.export ?? "default"}" could not be resolved in the "${
        fileReference.file
      }" module. ${
        Object.keys(resolved).length === 0
          ? `After bundling, no exports were found in the module. Please ensure that the "${
              fileReference.file
            }" module has a "${fileReference.export ?? "default"}" export with the desired value.`
          : `After bundling, the available exports were: ${Object.keys(
              resolved
            ).join(
              ", "
            )}. Please ensure that the export exists and is correctly named.`
      }`
    );
  }

  return result;
}

/**
 * Safely loads a file from the specified input, which can be a string, a {@link FileReference} object, or a {@link URL} object. The function resolves the file reference and returns the content of the file as a string. If an error occurs during the loading process, it returns `undefined` instead of throwing an error.
 *
 * @remarks
 * The input can be:
 * - A string representing the file path or URL.
 * - A {@link FileReference} object, which contains a `file` property specifying the file path and an optional `exportName` property for named exports.
 * - A {@link URL} object, which represents a URL to fetch the file from.
 *
 * The function also accepts optional overrides for the file resolution process through the `options` parameter.
 *
 * @param reference - The file reference to load. This can be either a string, a {@link FileReference} object, or a {@link URL} object.
 * @param options - Optional overrides for the file resolution process.
 * @returns The content of the file as a string, or `undefined` if an error occurs.
 */
export async function loadSafe<TResult>(
  reference: LoadReference,
  options: InferLoadOptions<typeof reference> = {}
): Promise<TResult | undefined> {
  try {
    return await load<TResult>(reference, options);
  } catch {
    return undefined;
  }
}
