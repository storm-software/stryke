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
import { isSetString, isString } from "@stryke/type-checks";
import type {
  FileReference,
  FileReferenceInput
} from "@stryke/types/configuration";
import {
  isValidGitHubRepoReference,
  isValidGitLabRepoReference,
  isValidURL
} from "@stryke/url/helpers";
import { VALID_OBJECT_SOURCE_EXTENSIONS } from "./constants";
import { extractFilePath } from "./helpers";

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
    isValidGitHubRepoReference(file) ||
    isValidGitLabRepoReference(file)
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
