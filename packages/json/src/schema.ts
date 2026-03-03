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

import type { StandardJSONSchemaV1 } from "@standard-schema/spec";
import { isFunction } from "@stryke/type-checks/is-function";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import type {
  JsonSchema7AllOfType,
  JsonSchema7ArrayType,
  JsonSchema7BooleanType,
  JsonSchema7LiteralType,
  JsonSchema7NumberType,
  JsonSchema7ObjectType,
  JsonSchema7PrimitiveLiteralType,
  JsonSchema7StringType,
  JsonSchema7TupleType
} from "./types";

/**
 * Type guard for {@link JsonSchema7AllOfType}
 *
 * @param schema - The schema to check
 * @returns True if the schema is a {@link JsonSchema7AllOfType}, false otherwise
 */
export function isJsonSchema7AllOfType(
  schema: any
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
  schema: any
): schema is JsonSchema7ObjectType {
  return "type" in schema && schema.type === "object";
}

/**
 * Type guard for {@link JsonSchema7StringType}
 *
 * @param schema - The schema to check
 * @returns True if the schema is a {@link JsonSchema7StringType}, false otherwise
 */
export function isJsonSchema7StringType(
  schema: any
): schema is JsonSchema7StringType {
  return "type" in schema && schema.type === "string";
}

/**
 * Type guard for {@link JsonSchema7NumberType}
 *
 * @param schema - The schema to check
 * @returns True if the schema is a {@link JsonSchema7NumberType}, false otherwise
 */
export function isJsonSchema7NumberType(
  schema: any
): schema is JsonSchema7NumberType {
  return (
    "type" in schema && (schema.type === "number" || schema.type === "integer")
  );
}

/**
 * Type guard for {@link JsonSchema7BooleanType}
 *
 * @param schema - The schema to check
 * @returns True if the schema is a {@link JsonSchema7BooleanType}, false otherwise
 */
export function isJsonSchema7BooleanType(
  schema: any
): schema is JsonSchema7BooleanType {
  return "type" in schema && schema.type === "boolean";
}

/**
 * Type guard for {@link JsonSchema7ArrayType}
 *
 * @param schema - The schema to check
 * @returns True if the schema is a {@link JsonSchema7ArrayType}, false otherwise
 */
export function isJsonSchema7ArrayType(
  schema: any
): schema is JsonSchema7ArrayType {
  return "type" in schema && schema.type === "array" && "items" in schema;
}

/**
 * Type guard for {@link JsonSchema7TupleType}
 *
 * @param schema - The schema to check
 * @returns True if the schema is a {@link JsonSchema7TupleType}, false otherwise
 */
export function isJsonSchema7TupleType(
  schema: any
): schema is JsonSchema7TupleType {
  return (
    "type" in schema &&
    schema.type === "array" &&
    "items" in schema &&
    Array.isArray(schema.items)
  );
}

/**
 * Type guard for {@link JsonSchema7PrimitiveLiteralType}
 *
 * @param schema - The schema to check
 * @returns True if the schema is a {@link JsonSchema7PrimitiveLiteralType}, false otherwise
 */
export function isJsonSchema7PrimitiveLiteralType(
  schema: any
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
  schema: any
): schema is JsonSchema7LiteralType {
  if (isJsonSchema7PrimitiveLiteralType(schema)) {
    return true;
  }

  if (!("type" in schema)) {
    return false;
  }

  return schema.type === "object" || schema.type === "array";
}

/**
 * Type guard to check if a value is a {@link StandardJSONSchemaV1 | Standard JSON Schema}.
 *
 * @remarks
 * This function checks if the value has the structure of a Standard JSON Schema, which includes a `~standard` property with a `jsonSchema` object that has `input` and `output` functions.
 *
 * @see https://standardschema.dev/json-schema
 *
 * @param value - The value to check.
 * @returns True if the value is a {@link StandardJSONSchemaV1 | Standard JSON Schema}, false otherwise.
 */
export function isStandardJsonSchema<Input = unknown, Output = Input>(
  value: any
): value is StandardJSONSchemaV1<Input, Output> {
  return (
    isSetObject(value) &&
    "~standard" in value &&
    isSetObject(value["~standard"]) &&
    "jsonSchema" in value["~standard"] &&
    isSetObject(value["~standard"].jsonSchema) &&
    "input" in value["~standard"].jsonSchema &&
    isFunction(value["~standard"].jsonSchema.input) &&
    "output" in value["~standard"].jsonSchema &&
    isFunction(value["~standard"].jsonSchema.output)
  );
}
