/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/license.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://docs.stormsoftware.com/projects/stryke
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import { isObject, isString } from "@stryke/type-checks";
import type {
  TypeDefinition,
  TypeDefinitionParameter
} from "@stryke/types/configuration";

/**
 * Parse a type definition parameter into a {@link TypeDefinition} object
 *
 * @param param - The parameter to parse
 * @returns The parsed type definition
 */
export const parseTypeDefinition = (
  param: TypeDefinitionParameter
): TypeDefinition | undefined => {
  if (isString(param)) {
    if (param.includes(":")) {
      const params = param.split(":");
      if (params.length > 1 && params[0]) {
        return {
          file: params[0],
          name: params[1]
        };
      }
    }

    if (param.includes("#")) {
      const params = param.split("#");
      if (params.length > 1 && params[0]) {
        return {
          file: params[0],
          name: params[1]
        };
      }
    }

    return {
      file: param
    };
  }

  if (isObject(param)) {
    return {
      file: param.file,
      name: param.name
    };
  }

  return undefined;
};
