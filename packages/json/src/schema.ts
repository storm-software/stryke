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

import type {
  JsonSchema7AllOfType,
  JsonSchema7StringType,
  JsonSchema7Type
} from "./types";

export const isJsonSchema7AllOfType = (
  type: JsonSchema7Type | JsonSchema7StringType
): type is JsonSchema7AllOfType => {
  if ("type" in type && type.type === "string") return false;
  return "allOf" in type;
};
