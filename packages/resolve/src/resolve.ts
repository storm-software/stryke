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

import { fetchRequest } from "@stryke/http/fetch";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { isURL } from "@stryke/type-checks/is-url";
import { isValidURL } from "@stryke/url/helpers";
import { isFileReference } from "./type-checks";
import type { ResolveInput, ResolveOptions } from "./types";

/**
 * Fetches the content of a URL and returns it as a string.
 *
 * @param input - The URL to fetch. This can be either a string or a {@link URL} object.
 * @returns A promise that resolves to the content of the URL as a string.
 */
export async function resolveURL(
  input: string | URL,
  options: ResolveOptions = {}
): Promise<string> {
  let value!: string;
  if (isSetString(input)) {
    if (!isValidURL(input)) {
      throw new Error(
        `The provided input "${input}" is not a valid URL. Please provide a valid URL to fetch the file.`
      );
    }
    if (input.startsWith("file://")) {
      throw new Error(
        `The provided input "${input}" is a file URL. Please provide a valid HTTP or HTTPS URL to fetch the file.`
      );
    }

    value = input;
  } else if (isURL(input)) {
    value = input.toString();
  } else {
    throw new Error(
      `The provided input "${String(input)}" is not a valid string or URL. Please provide a valid URL to fetch the file.`
    );
  }

  const response = await (options.fetch ?? fetchRequest)(value, {
    headers: options.headers
  });
  if (!response.ok) {
    throw new Error(
      `Failed to fetch the file from the URL "${value}". HTTP status: ${response.status} ${response.statusText}`
    );
  }

  return response.text();
}

/**
 * Compiles a type definition to a module and returns the specified export from the module.
 *
 * @param input - The type definition to compile. This can be either a string or a {@link FileReference} object.
 * @param options - Optional overrides for the ESBuild configuration.
 * @returns A promise that resolves to the compiled module.
 */
export async function resolve(
  input: ResolveInput,
  options?: ResolveOptions
): Promise<string> {
  let file!: string | URL;
  if (isFileReference(input)) {
    file = input.file;
  } else if (isSetString(input) || isURL(input)) {
    file = input;
  } else {
    throw new Error(
      `The provided input "${String(input)}" is not a valid string, URL, or FileReference. Please provide a valid input to resolve.`
    );
  }

  if (
    (isSetString(file) && isValidURL(file) && !file.startsWith("file://")) ||
    isURL(file)
  ) {
    return resolveURL(file, options);
  }

  throw new Error(
    `The provided input "${String(input)}" could not be resolved. Please provide a valid input to resolve.`
  );
}

/**
 * Safely compiles a type definition to a module and returns the specified export from the module.
 *
 * @param input - The type definition to compile. This can be either a string or a {@link FileReference} object.
 * @param options - Optional overrides for the ESBuild configuration.
 * @returns A promise that resolves to the compiled module.
 */
export async function resolveSafe(
  input: ResolveInput,
  options?: ResolveOptions
): Promise<string | undefined> {
  try {
    return await resolve(input, options);
  } catch {
    return undefined;
  }
}
