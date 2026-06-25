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

import type { FileReferenceInput } from "@stryke/types/configuration";

import { isSetString } from "@stryke/type-checks/is-set-string";
import { isFileReference } from "./type-checks";

/**
 * Extracts the file path from a {@link FileReferenceInput} value.
 *
 * @remarks
 * A {@link FileReferenceInput} can be either a {@link FileReference} object or a string that includes both a path to the TypeScript module and the name of the module export separated by a ":", "#", or ";" character. This function extracts the file path from either type of input.
 *
 * @param input - The {@link FileReferenceInput} value to extract the file path from.
 * @returns The extracted file path as a string.
 * @throws If the input is not a valid {@link FileReferenceInput}.
 */
export function extractFilePath(input: FileReferenceInput): string {
  if (!isFileReference(input) && !isSetString(input)) {
    throw new TypeError(
      `Expected a file reference input, but received: ${typeof input}`
    );
  }

  if (isFileReference(input)) {
    return input.file;
  }

  let file!: string;
  const separatorIndex = Math.max(
    input.lastIndexOf(":"),
    input.lastIndexOf("#"),
    input.lastIndexOf(";")
  );

  if (separatorIndex >= 0) {
    file = input.slice(0, separatorIndex);
  } else {
    file = input;
  }

  return file;
}
