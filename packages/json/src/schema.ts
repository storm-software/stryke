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
import { isObject } from "@stryke/type-checks/is-object";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isString } from "@stryke/type-checks/is-string";
import type {
  JsonSchemaAllOfType,
  JsonSchemaAnyOfType,
  JsonSchemaArrayType,
  JsonSchemaBooleanType,
  JsonSchemaLiteralType,
  JsonSchemaMetadata,
  JsonSchemaNumberType,
  JsonSchemaObjectType,
  JsonSchemaPrimitiveLiteralType,
  JsonSchemaRecordType,
  JsonSchemaStringType,
  JsonSchemaTupleType,
  JsonSchemaType
} from "./types";

/**
 * Type guard for {@link JsonSchemaAllOfType}
 *
 * @param schema - The schema to check
 * @returns True if the schema is a {@link JsonSchemaAllOfType}, false otherwise
 */
export function isJsonSchemaAllOfType(
  schema: any
): schema is JsonSchemaAllOfType {
  if (isSetObject(schema) && "type" in schema && schema.type === "string") {
    return false;
  }

  return isSetObject(schema) && "allOf" in schema;
}

/**
 * Type guard for {@link JsonSchemaAnyOfType}
 *
 * @param schema - The schema to check
 * @returns True if the schema is a {@link JsonSchemaAnyOfType}, false otherwise
 */
export function isJsonSchemaAnyOfType(
  schema: any
): schema is JsonSchemaAnyOfType {
  return (
    isSetObject(schema) && "anyOf" in schema && Array.isArray(schema.anyOf)
  );
}

/**
 * Type guard for {@link JsonSchemaObjectType}
 *
 * @param schema - The schema to check
 * @returns True if the schema is a {@link JsonSchemaObjectType}, false otherwise
 */
export function isJsonSchemaObjectType(
  schema: any
): schema is JsonSchemaObjectType {
  return isSetObject(schema) && "type" in schema && schema.type === "object";
}

/**
 * Type guard for {@link JsonSchemaStringType}
 *
 * @param schema - The schema to check
 * @returns True if the schema is a {@link JsonSchemaStringType}, false otherwise
 */
export function isJsonSchemaStringType(
  schema: any
): schema is JsonSchemaStringType {
  return isSetObject(schema) && "type" in schema && schema.type === "string";
}

/**
 * Type guard for {@link JsonSchemaNumberType}
 *
 * @param schema - The schema to check
 * @returns True if the schema is a {@link JsonSchemaNumberType}, false otherwise
 */
export function isJsonSchemaNumberType(
  schema: any
): schema is JsonSchemaNumberType {
  return (
    isSetObject(schema) &&
    "type" in schema &&
    (schema.type === "number" || schema.type === "integer")
  );
}

/**
 * Type guard for {@link JsonSchemaBooleanType}
 *
 * @param schema - The schema to check
 * @returns True if the schema is a {@link JsonSchemaBooleanType}, false otherwise
 */
export function isJsonSchemaBooleanType(
  schema: any
): schema is JsonSchemaBooleanType {
  return isSetObject(schema) && "type" in schema && schema.type === "boolean";
}

/**
 * Type guard for {@link JsonSchemaArrayType}
 *
 * @param schema - The schema to check
 * @returns True if the schema is a {@link JsonSchemaArrayType}, false otherwise
 */
export function isJsonSchemaArrayType(
  schema: any
): schema is JsonSchemaArrayType {
  return (
    isSetObject(schema) &&
    "type" in schema &&
    schema.type === "array" &&
    "items" in schema
  );
}

/**
 * Type guard for {@link JsonSchemaTupleType}
 *
 * @param schema - The schema to check
 * @returns True if the schema is a {@link JsonSchemaTupleType}, false otherwise
 */
export function isJsonSchemaTupleType(
  schema: any
): schema is JsonSchemaTupleType {
  return (
    isSetObject(schema) &&
    "type" in schema &&
    schema.type === "array" &&
    "items" in schema &&
    Array.isArray(schema.items)
  );
}

/**
 * Type guard for {@link JsonSchemaPrimitiveLiteralType}
 *
 * @param schema - The schema to check
 * @returns True if the schema is a {@link JsonSchemaPrimitiveLiteralType}, false otherwise
 */
export function isJsonSchemaPrimitiveLiteralType(
  schema: any
): schema is JsonSchemaPrimitiveLiteralType {
  if (!isSetObject(schema) || !("type" in schema)) {
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
 * Type guard for {@link JsonSchemaLiteralType}
 *
 * @param schema - The schema to check
 * @returns True if the schema is a {@link JsonSchemaLiteralType}, false otherwise
 */
export function isJsonSchemaLiteralType(
  schema: any
): schema is JsonSchemaLiteralType {
  if (isJsonSchemaPrimitiveLiteralType(schema)) {
    return true;
  }

  if (!isSetObject(schema) || !("type" in schema)) {
    return false;
  }

  return schema.type === "object" || schema.type === "array";
}

export function isJsonSchemaRecordType(
  schema: any
): schema is JsonSchemaRecordType {
  return (
    isSetObject(schema) &&
    "type" in schema &&
    schema.type === "object" &&
    "additionalProperties" in schema &&
    isSetObject(schema.additionalProperties) &&
    "propertyNames" in schema &&
    isSetObject(schema.propertyNames)
  );
}

export function isJsonSchemaMetadata(
  schema: any
): schema is JsonSchemaMetadata {
  return (
    isSetObject(schema) &&
    (!("$id" in schema) || isString(schema.$id)) &&
    (!("$schema" in schema) || isString(schema.$schema)) &&
    (!("$comment" in schema) || isString(schema.$comment)) &&
    (!("$defs" in schema) || isObject(schema.$defs)) &&
    (!("$dynamicRef" in schema) || isString(schema.$dynamicRef)) &&
    (!("$dynamicAnchor" in schema) || isString(schema.$dynamicAnchor)) &&
    (!("name" in schema) || isString(schema.name)) &&
    (!("title" in schema) || isString(schema.title)) &&
    (!("description" in schema) || isString(schema.description)) &&
    (!("alias" in schema) ||
      isString(schema.alias) ||
      (Array.isArray(schema.alias) && schema.alias.every(isString)))
  );
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

/**
 * Merges multiple {@link JsonSchemaMetadata} objects into a single object, combining their properties. If there are conflicting properties, the last one will take precedence.
 *
 * @param schemas - The schemas to merge
 * @returns The merged {@link JsonSchemaMetadata} object, or undefined if no valid schemas are provided
 */
export function mergeMetadataSchemaSafe(
  ...schemas: JsonSchemaMetadata[]
): JsonSchemaMetadata | undefined {
  const filtered = schemas.filter(isJsonSchemaMetadata);
  if (filtered.length === 0) {
    return undefined;
  }

  let result = {} as JsonSchemaMetadata;
  for (const schema of filtered) {
    result = {
      ...result,
      ...schema,
      $defs: {
        ...result.$defs,
        ...schema.$defs
      }
    };
  }

  return result;
}

/**
 * Merges multiple {@link JsonSchemaMetadata} objects into a single object, combining their properties. If there are conflicting properties, the last one will take precedence.
 *
 * @remarks
 * If any of the provided schemas are not valid {@link JsonSchemaMetadata} objects, or if no valid schemas are provided for merging, this function will throw an error. Use {@link mergeMetadataSchemaSafe} if you want to ignore invalid schemas instead.
 *
 * @param schemas - The schemas to merge
 * @returns The merged {@link JsonSchemaMetadata} object
 * @throws Error if any of the provided schemas are not valid {@link JsonSchemaMetadata} objects, or if no valid schemas are provided for merging. Use {@link mergeMetadataSchemaSafe} if you want to ignore invalid schemas instead.
 */
export function mergeMetadataSchemaStrict(
  ...schemas: JsonSchemaMetadata[]
): JsonSchemaMetadata {
  const filtered = schemas.filter(isJsonSchemaMetadata);
  if (filtered.length !== schemas.length) {
    throw new Error(
      `All schemas must be of type JsonSchemaMetadata - found ${
        schemas.length - filtered.length
      } invalid schema types`
    );
  }

  return mergeMetadataSchemaSafe(...schemas)!;
}

/**
 * Merges multiple {@link JsonSchemaObjectType} schemas into a single schema, combining their properties and required fields. If there are no valid object type schemas, throws an error.
 *
 * @remarks If there are overlapping properties, the last schema's property definition will take precedence. Required fields from all schemas will be combined, and duplicates will be removed. If all of the provided schemas are not valid {@link JsonSchemaObjectType} objects, or if no valid object type schemas are provided for merging, this function will throw an error. Use {@link mergeObjectTypeSchemaSafe} if you want to ignore invalid schemas instead.
 *
 * @param schemas - The schemas to merge
 * @returns The merged {@link JsonSchemaMetadata} object
 * @throws Error if all of the provided schemas are not valid {@link JsonSchemaObjectType} objects, or if no valid object type schemas are provided for merging. Use {@link mergeObjectTypeSchemaSafe} if you want to ignore invalid schemas instead.
 */
export function mergeMetadataSchema(
  ...schemas: JsonSchemaMetadata[]
): JsonSchemaMetadata {
  const merged = mergeMetadataSchemaSafe(...schemas);
  if (!merged) {
    throw new Error("No valid JsonSchemaMetadata objects provided for merge");
  }

  return merged;
}

/**
 * Merges multiple {@link JsonSchemaMetadata} objects into a single object, combining their properties. If there are conflicting properties, the last one will take precedence.
 *
 * @param schemas - The schemas to merge
 * @returns The merged {@link JsonSchemaMetadata} object, or undefined if no valid schemas are provided
 */
export function mergeObjectTypeSchemaSafe(
  ...schemas: JsonSchemaObjectType[]
): JsonSchemaObjectType | undefined {
  const filtered = schemas.filter(isJsonSchemaObjectType);
  if (filtered.length === 0) {
    return undefined;
  }

  const mergedProperties: Record<string, JsonSchemaType> = {};
  const mergedRequired: Set<string> = new Set();

  for (const schema of filtered) {
    Object.assign(mergedProperties, schema.properties);
    if (schema.required) {
      for (const prop of schema.required) {
        mergedRequired.add(prop);
      }
    }
  }

  return {
    ...mergeObjectTypeSchemaSafe(...schemas),
    type: "object",
    properties: mergedProperties,
    required: Array.from(mergedRequired)
  };
}

/**
 * Merges multiple {@link JsonSchemaObjectType} objects into a single object, combining their properties. If there are conflicting properties, the last one will take precedence.
 *
 * @remarks
 * If any of the provided schemas are not valid {@link JsonSchemaObjectType} objects, or if no valid schemas are provided for merging, this function will throw an error. Use {@link mergeObjectTypeSchemaSafe} if you want to ignore invalid schemas instead.
 *
 * @param schemas - The schemas to merge
 * @returns The merged {@link JsonSchemaObjectType} object
 * @throws Error if any of the provided schemas are not valid {@link JsonSchemaObjectType} objects, or if no valid schemas are provided for merging. Use {@link mergeObjectTypeSchemaSafe} if you want to ignore invalid schemas instead.
 */
export function mergeObjectTypeSchemaStrict(
  ...schemas: JsonSchemaObjectType[]
): JsonSchemaObjectType {
  const filtered = schemas.filter(isJsonSchemaObjectType);
  if (filtered.length !== schemas.length) {
    throw new Error(
      `All schemas must be of type JsonSchemaObjectType - found ${
        schemas.length - filtered.length
      } invalid schema types`
    );
  }

  return mergeObjectTypeSchemaSafe(...schemas)!;
}

/**
 * Merges multiple {@link JsonSchemaObjectType} schemas into a single schema, combining their properties and required fields. If there are no valid object type schemas, throws an error.
 *
 * @remarks If there are overlapping properties, the last schema's property definition will take precedence. Required fields from all schemas will be combined, and duplicates will be removed. If all of the provided schemas are not valid {@link JsonSchemaObjectType} objects, or if no valid object type schemas are provided for merging, this function will throw an error. Use {@link mergeObjectTypeSchemaSafe} if you want to ignore invalid schemas instead.
 *
 * @param schemas - The schemas to merge
 * @returns The merged {@link JsonSchemaObjectType} object
 * @throws Error if all of the provided schemas are not valid {@link JsonSchemaObjectType} objects, or if no valid object type schemas are provided for merging. Use {@link mergeObjectTypeSchemaSafe} if you want to ignore invalid schemas instead.
 */
export function mergeObjectTypeSchema(
  ...schemas: JsonSchemaObjectType[]
): JsonSchemaObjectType {
  const merged = mergeObjectTypeSchemaSafe(...schemas);
  if (!merged) {
    throw new Error("No valid JsonSchemaObjectType objects provided for merge");
  }

  return merged;
}

/**
 * Extracts a {@link JsonSchemaObjectType} from a given {@link JsonSchemaType}, if it exists.
 *
 * @param schema - The schema to extract the object type from
 * @returns The extracted {@link JsonSchemaObjectType}, or undefined if it does not exist
 */
export function extractObjectTypeSchema(
  schema: JsonSchemaType
): JsonSchemaObjectType | undefined {
  if (isJsonSchemaObjectType(schema)) {
    return schema;
  }

  if (isJsonSchemaAllOfType(schema)) {
    const extracted = schema.allOf
      .map(extractObjectTypeSchema)
      .filter((s): s is JsonSchemaObjectType => s !== undefined);
    if (extracted.length === 0) {
      return undefined;
    }

    return mergeObjectTypeSchemaSafe(...extracted);
  }

  if (isJsonSchemaAnyOfType(schema)) {
    const extracted = schema.anyOf
      .map(extractObjectTypeSchema)
      .filter((s): s is JsonSchemaObjectType => s !== undefined);
    if (extracted.length === 0 || extracted.length !== schema.anyOf.length) {
      return undefined;
    }

    const [first, ...rest] = extracted as [
      JsonSchemaObjectType,
      ...JsonSchemaObjectType[]
    ];
    const commonProperties: Record<string, JsonSchemaType> = {};
    for (const [key, value] of Object.entries(first.properties)) {
      if (rest.every(s => s.properties && key in s.properties)) {
        commonProperties[key] = value;
      }
    }

    const commonRequired = (first.required ?? []).filter(prop =>
      rest.every(s => s.required?.includes(prop))
    );

    return {
      type: "object",
      properties: commonProperties,
      required: commonRequired
    };
  }

  if (isJsonSchemaRecordType(schema)) {
    return {
      type: "object",
      properties: {},
      additionalProperties: schema.additionalProperties,
      required: []
    };
  }

  return undefined;
}
