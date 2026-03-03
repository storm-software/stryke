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

import type { JsonSchema7Type } from "@stryke/json";
import { zodToJsonSchema } from "zod-to-json-schema";
import * as z4 from "zod/v4/core";
import { isZod3Type, isZod4Type } from "./is-zod-type";
import type { ZodType } from "./types";

/**
 * Extracts a JSON Schema from a given Zod schema, supporting both version 3 and version 4 of Zod.
 *
 * @param type - The Zod schema to extract the JSON Schema from. Can be either a Zod v3 or v4 schema.
 * @param target - The JSON Schema draft version to target. Defaults to "draft-07".
 * @returns The extracted JSON Schema.
 */
export function extractJsonSchema(
  type: ZodType,
  target: "draft-07" | "draft-2020-12" = "draft-07"
) {
  if (isZod3Type(type)) {
    const result = zodToJsonSchema(type, {
      $refStrategy: "root",
      definitionPath: "$defs",
      target: target === "draft-07" ? "jsonSchema7" : "jsonSchema2019-09",
      mapStrategy: "entries",
      errorMessages: false,
      markdownDescription: false
    });
    if (!result) {
      throw new Error("Failed to extract JSON Schema from Zod v3 schema");
    }

    return result;
  } else if (isZod4Type(type)) {
    return z4.toJSONSchema(type, {
      target: target === "draft-07" ? "draft-07" : "draft-2020-12",
      unrepresentable: "any",
      reused: "ref"
    });
  } else {
    throw new Error("Unsupported Zod schema version");
  }
}

/**
 * Extracts a JSON Schema (draft-07) from a given Zod schema, supporting both version 3 and version 4 of Zod.
 *
 * @remarks
 * This function is a convenience wrapper around `extractJsonSchema` that defaults to targeting the JSON Schema draft-07 specification.
 *
 * @param type - The Zod schema to extract the JSON Schema from. Can be either a Zod v3 or v4 schema.
 * @returns The extracted JSON Schema.
 */
export function extractJsonSchema7(type: ZodType) {
  return extractJsonSchema(type, "draft-07") as JsonSchema7Type;
}
