/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

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

import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import type {
  FileReference,
  FileReferenceInput
} from "@stryke/types/configuration";

/**
 * Parse a file reference input into a {@link FileReference} object
 *
 * @example
 * ```ts
 * extractFileReference("./src/types/env.ts#EnvConfiguration"); // Returns: { file: "./src/types/env.ts", export: "EnvConfiguration" }
 * extractFileReference({ file: "./src/types/env.ts", export: "EnvConfiguration" }); // Returns: { file: "./src/types/env.ts", export: "EnvConfiguration" }
 * extractFileReference("./src/types/env.ts"); // Returns: { file: "./src/types/env.ts" }
 * extractFileReference({ file: "./src/types/env.ts" }); // Returns: { file: "./src/types/env.ts" }
 * extractFileReference(123); // Returns: undefined
 * extractFileReference({}); // Returns: undefined
 * extractFileReference(""); // Returns: undefined
 * ```
 *
 * @param input - The file reference input to parse, which can be either a string or an object
 * @returns The parsed file reference object, or `undefined` if the parameter is not a valid file reference
 */
export function extractFileReference(
  input: FileReferenceInput
): FileReference | undefined {
  if (isSetString(input)) {
    if (input.includes(":") || input.includes("#") || input.includes(";")) {
      const params = input.split(/[:#;]/);
      if (params.length > 1 && params[0]) {
        return {
          file: params[0],
          export: params[1]
        };
      }
    }

    return {
      file: input
    };
  }

  if (isSetObject(input)) {
    return {
      file: input.file,
      export: input.export
    };
  }

  return undefined;
}
