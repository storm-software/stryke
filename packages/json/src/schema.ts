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
  JsonSchema7ArrayType,
  JsonSchema7LiteralType,
  JsonSchema7ObjectType,
  JsonSchema7PrimitiveLiteralType,
  JsonSchema7StringType,
  JsonSchema7Type
} from "./types";

/**
 * Type guard for {@link JsonSchema7AllOfType}
 *
 * @param schema - The schema to check
 * @returns True if the schema is a {@link JsonSchema7AllOfType}, false otherwise
 */
export function isJsonSchema7AllOfType(
  schema: JsonSchema7Type | JsonSchema7StringType
): schema is JsonSchema7AllOfType {
  if ("type" in schema && schema.type === "string") {
    return false;
  }

  return "allOf" in schema;
}

/**
 * Type guard for {@link JsonSchema7ObjectType}
 *
 * @param schema - The schema to check
 * @returns True if the schema is a {@link JsonSchema7ObjectType}, false otherwise
 */
export function isJsonSchema7ObjectType(
  schema: JsonSchema7Type | JsonSchema7StringType
): schema is JsonSchema7ObjectType {
  if ("type" in schema && schema.type === "object") {
    return false;
  }

  return "properties" in schema;
}

/**
 * Type guard for {@link JsonSchema7ArrayType}
 *
 * @param schema - The schema to check
 * @returns True if the schema is a {@link JsonSchema7ArrayType}, false otherwise
 */
export function isJsonSchema7ArrayType(
  schema: JsonSchema7Type
): schema is JsonSchema7ArrayType {
  return "type" in schema && schema.type === "array" && "items" in schema;
}

/**
 * Type guard for {@link JsonSchema7PrimitiveLiteralType}
 *
 * @param schema - The schema to check
 * @returns True if the schema is a {@link JsonSchema7PrimitiveLiteralType}, false otherwise
 */
export function isJsonSchema7PrimitiveLiteralType(
  schema: JsonSchema7Type
): schema is JsonSchema7PrimitiveLiteralType {
  if (!("type" in schema)) {
    return false;
  }

  const { type } = schema;

  return (
    (type === "string" ||
      type === "number" ||
      type === "integer" ||
      type === "boolean") &&
    "const" in schema
  );
}

/**
 * Type guard for {@link JsonSchema7LiteralType}
 *
 * @param schema - The schema to check
 * @returns True if the schema is a {@link JsonSchema7LiteralType}, false otherwise
 */
export function isJsonSchema7LiteralType(
  schema: JsonSchema7Type
): schema is JsonSchema7LiteralType {
  if (isJsonSchema7PrimitiveLiteralType(schema)) {
    return true;
  }

  if (!("type" in schema)) {
    return false;
  }

  return schema.type === "object" || schema.type === "array";
}
