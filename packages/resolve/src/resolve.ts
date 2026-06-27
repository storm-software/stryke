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

import { resolve as resolveFile } from "@stryke/fs/resolve";
import { omit } from "@stryke/helpers/omit";
import { fetchRequest } from "@stryke/http/fetch";
import { findFileExtensionSafe } from "@stryke/path/find";
import { isValidPath } from "@stryke/path/is-valid-path";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { isURL } from "@stryke/type-checks/is-url";
import { isURLString, isValidURL } from "@stryke/url/helpers";
import { defu } from "defu";
import { readFile } from "node:fs/promises";
import { parseFilename } from "ufo";
import { bundle } from "./bundle";
import { BUNDLE_EXTENSIONS } from "./constants";
import { extractGitHubReference, extractGitLabReference } from "./helpers";
import {
  isFileReference,
  isGitHubReference,
  isGitLabReference
} from "./type-checks";
import type {
  FilePathResolveOptions,
  GitHubReference,
  GitLabReference,
  InferResolveOptions,
  ResolveInput,
  URLReference,
  URLResolveOptions
} from "./types";

/**
 * Fetches the content of a URL and returns it as a string.
 *
 * @param input - The URL to fetch. This can be either a string or a {@link URL} object.
 * @returns A promise that resolves to the content of the URL as a string.
 */
export async function resolveURL(
  input: URLReference | URL,
  options: URLResolveOptions = {}
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
 * Resolve a file in a GitHub repository via a {@link GitHubReference} string.
 *
 * @remarks
 * A GitHub repository reference string, starting with either `"github:"` or `"gh:"`, an optional branch or tag, and optionally including a specific file path within the repository (for example: `"github:main:storm-software/stryke/packages/base/resolve/src/types.ts"`). It is also valid to provide the branch or tag after the file path (for example: `"github:storm-software/stryke/packages/resolve/src/types.ts@main"`).
 *
 * @param input - The {@link GitHubReference} string to resolve.
 * @param options - Optional overrides for the fetch configuration.
 * @returns A promise that resolves to the content of the file as a string.
 */
export async function resolveGitHub(
  input: GitHubReference,
  options: URLResolveOptions = {}
): Promise<string> {
  const { owner, repo, branch, filePath } = extractGitHubReference(input);

  return resolveURL(
    `https://raw.githubusercontent.com/${owner}/${repo}/${encodeURIComponent(
      branch
    )}${
      filePath
        ? `/${filePath
            .split("/")
            .filter(Boolean)
            .map(segment => encodeURIComponent(segment))
            .join("/")}`
        : ""
    }`,
    options
  );
}

/**
 * Resolves a file in a GitLab repository via a {@link GitLabReference} string.
 *
 * @remarks
 * A GitLab repository reference string, starting with either `"gitlab:"` or `"gl:"`, an optional branch or tag, and optionally including a specific file path within the repository (for example: `"gitlab:master:storm-software/stryke/packages/resolve/src/types.ts"`). It is also valid to provide the branch or tag after the file path (for example: `"gitlab:storm-software/stryke/packages/resolve/src/types.ts@master"`).
 *
 * @param input - The {@link GitLabReference} string to resolve.
 * @param options - Optional overrides for the fetch configuration.
 * @returns A promise that resolves to the content of the file as a string.
 */
export async function resolveGitLab(
  input: GitLabReference,
  options: URLResolveOptions = {}
): Promise<string> {
  const { owner, repo, branch, filePath } = extractGitLabReference(input);

  return resolveURL(
    `https://gitlab.com/${owner}/${repo}/-/raw/${encodeURIComponent(branch)}${
      filePath
        ? `/${filePath
            .split("/")
            .filter(Boolean)
            .map(segment => encodeURIComponent(segment))
            .join("/")}`
        : ""
    }`,
    options
  );
}

/**
 * Resolves a file path to its content as a string.
 *
 * @remarks
 * Valid inputs include the following two options:
 * 1. A file path string (for example: `"./src/types.ts"`).
 * 2. A TypeScript module name string (for example: `"@stryke/resolve"`), and optionally a specific module export from the package (for example: `"@stryke/resolve/some-module"`).
 *
 * @param input - The file path or module name string to resolve.
 * @param options - Optional overrides for the file path resolution.
 */
export async function resolveFilePath(
  input: string,
  options: FilePathResolveOptions = {}
): Promise<string> {
  if (!isValidPath(input)) {
    throw new Error(
      `The provided input "${String(input)}" is not a valid file path. Please provide a valid file path to resolve.`
    );
  }

  const path = await resolveFile(
    input,
    defu(
      options.fs
        ? {
            ...options.fs,
            stat: options.fs.statAsync,
            realpath: options.fs.realpathAsync,
            readFile: options.fs.readFileAsync
          }
        : {},
      options.cwd
        ? {
            paths: [options.cwd]
          }
        : {},
      {
        extensions: options.resolveExtensions,
        conditions: options.conditions
      }
    )
  );

  return (await (options.fs?.readFileAsync
    ? options.fs.readFileAsync(path, "utf8")
    : readFile(path, "utf8"))) as string;
}

/**
 * Resolves a file reference to its content as a string.
 *
 * @remarks
 * The `ResolveInput` type can be one of the following variants:
 * - A file path string (for example: `"./src/types.ts"`).
 * - A URL string (for example: `"https://example.com/config.json"`).
 * - A GitHub repository reference string, starting with either `"github:"` or `"gh:"`, an optional branch or tag, and optionally including a specific file path within the repository (for example: `"github:main:storm-software/stryke/packages/base/resolve/src/types.ts"`). It is also valid to provide the branch or tag after the file path (for example: `"github:storm-software/stryke/packages/resolve/src/types.ts@main"`).
 * - A GitLab repository reference string, starting with either `"gitlab:"` or `"gl:"`, an optional branch or tag, and optionally including a specific file path within the repository (for example: `"gitlab:master:storm-software/stryke/packages/resolve/src/types.ts"`). It is also valid to provide the branch or tag after the file path (for example: `"gitlab:storm-software/stryke/packages/resolve/src/types.ts@master"`).
 * - A TypeScript module name string (for example: `"@stryke/resolve"`), and optionally a specific module export from the package (for example: `"@stryke/resolve/some-module"`).
 * - A {@link URL} object, which represents a URL to fetch the file from.
 *
 * @param input - The file reference to resolve. This can be either a string or a {@link FileReference} object.
 * @param options - Optional overrides for the file resolution.
 * @returns A promise that resolves to the content of the file as a string.
 */
export async function resolve(
  input: ResolveInput,
  options: InferResolveOptions<typeof input> = {}
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

  let content!: string;
  if (
    (isSetString(file) &&
      (isValidURL(file) || isURLString(file)) &&
      !file.startsWith("file://")) ||
    isURL(file)
  ) {
    if (isSetString(file) && !isURLString(file)) {
      file = new URL(file);
    }

    content = await resolveURL(file, options);
  } else if (isGitHubReference(file)) {
    content = await resolveGitHub(file, options);
  } else if (isGitLabReference(file)) {
    content = await resolveGitLab(file, options);
  } else if (isValidPath(file)) {
    content = await resolveFilePath(file, options);
  } else {
    throw new Error(
      `The provided input "${String(input)}" could not be resolved. Please provide a valid input to resolve.`
    );
  }

  if (
    !options.skipBundle &&
    ((options.extension && BUNDLE_EXTENSIONS.includes(options.extension)) ||
      (isURL(file) &&
        parseFilename(input.toString()) &&
        BUNDLE_EXTENSIONS.includes(
          parseFilename(input.toString())!.replace(/\.[^/.]+$/, "")
        )) ||
      (isSetString(file) &&
        findFileExtensionSafe(file) &&
        BUNDLE_EXTENSIONS.includes(findFileExtensionSafe(file))))
  ) {
    return bundle(content, {
      ...omit(options, ["extension", "skipBundle"]),
      originalInput: input
    }).then(result => result.text);
  }

  return content;
}

/**
 * Safely resolves a file reference to its content as a string.
 *
 * @param input - The file reference to resolve. This can be either a string or a {@link FileReference} object.
 * @param options - Optional overrides for the ESBuild configuration.
 * @returns A promise that resolves to the content of the file as a string, or `undefined` if the resolution fails.
 */
export async function resolveSafe(
  input: ResolveInput,
  options?: InferResolveOptions<typeof input>
): Promise<string | undefined> {
  try {
    return await resolve(input, options);
  } catch {
    return undefined;
  }
}
