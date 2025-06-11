/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/projects/stryke/license.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://docs.stormsoftware.com/projects/stryke
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import type { FileResult, FileStatus } from "@stryke/types/file";
import { isSetObject } from "./is-set-object";
import { isSetString } from "./is-set-string";

/**
 * Check if the provided value is a `FileResult` object
 *
 * @param value - The value to type check
 * @returns An indicator specifying if the value provided is a `FileResult` object
 */
export const isFileResult = (value: any): value is FileResult => {
  return (
    isSetObject(value) &&
    "status" in value &&
    ["initialized", "validated", "uploaded", "failed"].includes(
      value.status as FileStatus
    ) &&
    (isSetString((value as FileResult)?.uri) ||
      isSetObject((value as FileResult)?.file))
  );
};
