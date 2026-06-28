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

import { findFileExtensionSafe } from "@stryke/path/find";
import { isValidPath } from "@stryke/path/is-valid-path";
import { isSetString, isString, isURL } from "@stryke/type-checks";
import type {
  FileReference,
  FileReferenceInput
} from "@stryke/types/configuration";
import { isValidURL } from "@stryke/url/helpers";
import { VALID_OBJECT_SOURCE_EXTENSIONS } from "./constants";
import { extractFilePath } from "./helpers";
import { GITHUB_REFERENCE_REGEX, GITLAB_REFERENCE_REGEX } from "./regex";
import type {
  GitHubReference,
  GitLabReference,
  LoadReference,
  ResolveReference,
  URLReference
} from "./types";

/**
 * Checks if a given file name has a valid object source file extension.
 *
 * @param file - The file name to check for a valid object source extension.
 * @returns `true` if the file name has a valid object source extension, otherwise `false`.
 */
export function isValidObjectSourceFile(file: string): boolean {
  return VALID_OBJECT_SOURCE_EXTENSIONS.includes(findFileExtensionSafe(file));
}

/**
 * Checks if the provided entry is a file reference.
 *
 * @param input - The input to check.
 * @returns A boolean indicating whether the input is a {@link FileReference} object.
 */
export function isFileReference(input: any): input is FileReference {
  return !isString(input) && input.file !== undefined;
}

/**
 * Check if a string is a valid GitHub repository reference, including optional branches and file paths.
 *
 * @remarks
 * A GitHub repository reference string, starting with either `"github:"` or `"gh:"`, and optionally including a specific file path within the repository (for example: `"github:storm-software/stryke/src/types.ts@main"`).
 *
 * @param input - The string to check.
 * @returns `true` if the string is a valid GitHub repository reference, otherwise `false`.
 */
export function isGitHubReference(input: string): input is GitHubReference {
  return GITHUB_REFERENCE_REGEX.test(input);
}

/**
 * Check if a string is a valid GitLab repository reference, including optional branches and file paths.
 *
 * @remarks
 * A GitLab repository reference string, starting with either `"gitlab:"` or `"gl:"`, and optionally including a specific file path within the repository (for example: `"gitlab:storm-software/stryke/src/types.ts@master"`).
 *
 * @param input - The string to check.
 * @returns `true` if the string is a valid GitLab repository reference, otherwise `false`.
 */
export function isGitLabReference(input: string): input is GitLabReference {
  return GITLAB_REFERENCE_REGEX.test(input);
}

export function isURLReference(input: any): input is URLReference {
  return (
    isGitHubReference(input) || isGitLabReference(input) || isValidURL(input)
  );
}

/**
 * Checks if the provided entry is a file reference string.
 *
 * @remarks
 * A file reference string (this value can include both a path to the TypeScript module and the name of the module export separated by a ":", "#", or ";" character - for example: `"./src/types.ts#ExampleExport"`).
 *
 * @param input - The input to check.
 * @returns A boolean indicating whether the input is a file reference string.
 */
export function isFileReferenceString(input: any): input is string {
  if (!isSetString(input)) {
    return false;
  }

  const file = extractFilePath(input);

  return (
    isValidURL(file) ||
    isValidPath(file) ||
    isGitHubReference(file) ||
    isGitLabReference(file)
  );
}

/**
 * Checks if the provided entry is a valid {@link FileReferenceInput}.
 *
 * @remarks
 * A {@link FileReferenceInput} can be either a {@link FileReference} object or a file reference string.
 *
 * @param input - The input to check.
 * @returns `true` if the input is a valid {@link FileReferenceInput}, otherwise `false`.
 */
export function isFileReferenceInput(input: any): input is FileReferenceInput {
  return isFileReference(input) || isFileReferenceString(input);
}

/**
 * Checks if the provided entry is a valid {@link ResolveReference}.
 *
 * @remarks
 * A {@link ResolveReference} can be either a file reference string, a URL reference, or a valid URL.
 *
 * @param input - The input to check.
 * @returns `true` if the input is a valid {@link ResolveReference}, otherwise `false`.
 */
export function isResolveReference(input: any): input is ResolveReference {
  return (
    (isSetString(input) && isValidPath(input)) ||
    isURLReference(input) ||
    isURL(input)
  );
}

/**
 * Checks if the provided entry is a valid {@link LoadReference}.
 *
 * @remarks
 * A {@link LoadReference} can be either a {@link ResolveReference} or a {@link FileReference}.
 *
 * @param input - The input to check.
 * @returns `true` if the input is a valid {@link LoadReference}, otherwise `false`.
 */
export function isLoadReference(input: any): input is LoadReference {
  return isResolveReference(input) || isFileReference(input);
}
