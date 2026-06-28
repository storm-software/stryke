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

import type { ParseOptions } from "jsonc-parser";

export type PrimitiveJsonValue = string | number | boolean | undefined | null;

export interface Class {
  new (...args: any[]): any;
}

export type JsonValue = PrimitiveJsonValue | JsonArray | JsonObject;

export type JsonArray = Array<JsonValue>;

export interface JsonObject {
  [key: string]: JsonValue;
}

export type ClassInstance = any;

export type SerializableJsonValue =
  | symbol
  | Set<JsonValue>
  | Map<JsonValue, JsonValue>
  | undefined
  | bigint
  | Date
  | ClassInstance
  | RegExp;

export type Tree<T> = InnerNode<T> | Leaf<T>;
export type Leaf<T> = [T];
export type InnerNode<T> = [T, Record<string, Tree<T>>];

export type PrimitiveTypeAnnotation = "number" | "undefined" | "bigint";
export type LeafTypeAnnotation =
  PrimitiveTypeAnnotation | "regexp" | "Date" | "Error" | "URL";

export type TypedArrayAnnotation = ["typed-array", string];
export type ClassTypeAnnotation = ["class", string];
export type SymbolTypeAnnotation = ["symbol", string];
export type CustomTypeAnnotation = ["custom", string];
export type SimpleTypeAnnotation = LeafTypeAnnotation | "map" | "set";
export type CompositeTypeAnnotation =
  | TypedArrayAnnotation
  | ClassTypeAnnotation
  | SymbolTypeAnnotation
  | CustomTypeAnnotation;
export type TypeAnnotation = SimpleTypeAnnotation | CompositeTypeAnnotation;

export interface JsonParseOptions extends ParseOptions {
  /**
   * Expect JSON with javascript-style
   *
   * @defaultValue false
   */
  expectComments?: boolean;

  /**
   * Disallow javascript-style
   *
   * @defaultValue false
   */
  disallowComments?: boolean;

  /**
   * Allow trailing commas in the JSON content
   */
  allowTrailingComma?: boolean;
}

export interface JsonSerializeOptions {
  /**
   * the whitespaces to add as indentation to make the output more readable.
   *
   * @defaultValue 2
   */
  spaces?: number;
}

export interface JsonParserResult {
  json: JsonValue;
  meta?: {
    values?:
      Tree<TypeAnnotation> | Record<string, Tree<TypeAnnotation>> | undefined;
    referentialEqualities?:
      | Record<string, string[]>
      | [string[]]
      | [string[], Record<string, string[]>];
  };
}

export interface JsonParserInterface {
  parse: <TData = any>(strData: string) => TData;
  stringify: <TData = any>(data: TData) => string;
  serialize: (object: JsonValue) => JsonParserResult;
  deserialize: <TData = any>(payload: JsonParserResult) => TData;

  register: <TData = any, TJsonValue extends JsonValue = JsonValue>(
    name: string,
    serialize: (object: JsonValue) => TJsonValue,
    deserialize: (payload: TJsonValue) => TData,
    isApplicable: (data: any) => data is TData
  ) => void;
}

export interface JsonSchemaMetadata {
  /**
   * The `$id` keyword is used to identify a schema and can be used for referencing the schema within other schemas. It is a URI that serves as a unique identifier for the schema.
   *
   * @see https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-validation-01#section-8.2.1
   */
  $id?: string;

  /**
   * The `$schema` keyword is used to specify the version of the JSON Schema specification that the schema adheres to. It is a URI that indicates which version of the JSON Schema specification the schema is written against.
   *
   * @see https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-validation-01#section-8.2.2
   */
  $schema?: string;

  /**
   * The `$comment` keyword is used to add comments to a JSON Schema. It allows schema authors to include human-readable explanations or notes within the schema without affecting its validation behavior.
   *
   * @see https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-validation-01#section-8.2.3
   */
  $comment?: string;

  /**
   * The `$defs` keyword is used to define reusable sub-schemas within a JSON Schema. It allows you to define sub-schemas that can be referenced elsewhere in the schema using the `$ref` keyword. The `$defs` keyword is an object where each key is a unique identifier for the sub-schema, and the value is the sub-schema itself.
   *
   * @see https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-validation-01#section-8.2.4
   * @see https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-00#section-8.2.4
   * @see https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-validation-00#appendix-A
   */
  $defs?: {
    [key: string]: JsonSchemaType;
  };

  /**
   * The `$dynamicRef` keyword is used to reference a dynamic anchor defined in a JSON Schema. It allows you to reference a sub-schema that is determined at runtime based on the context of the validation. The value of `$dynamicRef` is a URI that points to the dynamic anchor defined using the `$dynamicAnchor` keyword.
   *
   * @see https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-validation-01#section-8.2.6
   * @see https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-validation-01#section-8.2.7
   */
  $dynamicRef?: string;

  /**
   * The `$dynamicAnchor` keyword is used to define a dynamic anchor within a JSON Schema. A dynamic anchor is a placeholder that can be referenced using the `$dynamicRef` keyword. It allows for more flexible referencing of sub-schemas, as the actual schema that the dynamic anchor points to can be determined at runtime based on the context of the validation.
   *
   * @see https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-validation-01#section-8.2.6
   * @see https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-validation-01#section-8.2.7
   */
  $dynamicAnchor?: string;

  /**
   * The `name` keyword is a custom metadata property that can be used to provide a human-readable name for the schema. It is not part of the official JSON Schema specification but can be useful for documentation and identification purposes.
   */
  name?: string;

  /**
   * The `title` keyword is a custom metadata property that can be used to provide a human-readable title for the schema. It is not part of the official JSON Schema specification but can be useful for documentation and identification purposes.
   */
  title?: string;

  /**
   * The `default` keyword is used to specify a default value for a property in a JSON Schema. It provides a default value that can be used when an instance does not provide a value for that property.
   *
   * @see https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-validation-01#section-8.2.5
   */
  default?: any;

  /**
   * The `description` keyword is used to provide a human-readable description of the schema or a specific property within the schema. It is not part of the official JSON Schema specification but can be useful for documentation purposes.
   */
  description?: string;

  /**
   * The `alias` keyword is a custom metadata property that can be used to provide alternative names or aliases for the schema. It is not part of the official JSON Schema specification but can be useful for documentation and identification purposes.
   */
  alias?: string | string[];
}

export interface JsonSchemaAnyType extends JsonSchemaMetadata {
  $ref?: string;
}

export interface JsonSchemaArrayType extends JsonSchemaMetadata {
  type: "array";
  items?: JsonSchemaType;
  minItems?: number;
  maxItems?: number;
}

export interface JsonSchemaBigintType extends JsonSchemaMetadata {
  type: "integer";
  format: "int64";
  minimum?: bigint;
  exclusiveMinimum?: bigint;
  maximum?: bigint;
  exclusiveMaximum?: bigint;
  multipleOf?: bigint;
}

export interface JsonSchemaBooleanType extends JsonSchemaMetadata {
  type: "boolean";
}

export type JsonSchemaDateType = JsonSchemaMetadata &
  (
    | {
        type: "integer" | "string";
        format: "unix-time" | "date-time" | "date";
        minimum?: number;
        maximum?: number;
      }
    | {
        anyOf: JsonSchemaDateType[];
      }
  );

export interface JsonSchemaEnumType extends JsonSchemaMetadata {
  type: "string";
  enum: string[];
}

export interface JsonSchemaAllOfType extends JsonSchemaMetadata {
  allOf: JsonSchemaType[];
  unevaluatedProperties?: boolean;
}

export interface JsonSchemaPrimitiveLiteralType extends JsonSchemaMetadata {
  type: "string" | "number" | "integer" | "boolean";
  const: string | number | boolean;
}

export type JsonSchemaLiteralType = JsonSchemaMetadata &
  (
    | JsonSchemaPrimitiveLiteralType
    | {
        type: "object" | "array";
      }
  );

export interface JsonSchemaMapType extends JsonSchemaMetadata {
  type: "array";
  maxItems: 125;
  items: {
    type: "array";
    items: [JsonSchemaType, JsonSchemaType];
    minItems: 2;
    maxItems: 2;
  };
}

export interface JsonSchemaNativeEnumType extends JsonSchemaMetadata {
  type: "string" | "number" | ["string", "number"];
  enum: (string | number)[];
}

export interface JsonSchemaNeverType extends JsonSchemaMetadata {
  not: JsonSchemaAnyType;
}

export interface JsonSchemaNullType extends JsonSchemaMetadata {
  type: "null";
}

export type JsonSchemaNullableType = JsonSchemaMetadata &
  (
    | {
        anyOf: [JsonSchemaType, JsonSchemaNullType];
      }
    | {
        type: [string, "null"];
      }
  );

export interface JsonSchemaNumberType extends JsonSchemaMetadata {
  type: "number" | "integer";
  minimum?: number;
  exclusiveMinimum?: number;
  maximum?: number;
  exclusiveMaximum?: number;
  multipleOf?: number;
}

export interface JsonSchemaObjectType extends JsonSchemaMetadata {
  type: "object";
  properties: Record<string, JsonSchemaType>;
  additionalProperties?: boolean | JsonSchemaType;
  required?: string[];
}

export interface JsonSchemaStringType extends JsonSchemaMetadata {
  type: "string";
  minLength?: number;
  maxLength?: number;
  format?:
    | "email"
    | "idn-email"
    | "uri"
    | "uuid"
    | "date-time"
    | "ipv4"
    | "ipv6"
    | "date"
    | "time"
    | "duration";
  pattern?: string;
  contentEncoding?: string;
}

export interface JsonSchemaSetType extends JsonSchemaMetadata {
  type: "array";
  uniqueItems: true;
  items?: JsonSchemaType;
  minItems?: number;
  maxItems?: number;
}

export type JsonSchemaRecordPropertyNamesType = JsonSchemaMetadata &
  (Omit<JsonSchemaStringType, "type"> | Omit<JsonSchemaEnumType, "type">);

export interface JsonSchemaRecordType extends JsonSchemaMetadata {
  type: "object";
  additionalProperties?: JsonSchemaType | true;
  propertyNames?: JsonSchemaRecordPropertyNamesType;
}

export type JsonSchemaTupleType = JsonSchemaMetadata & {
  type: "array";
  minItems: number;
  items: JsonSchemaType[];
} & (
    | {
        maxItems: number;
      }
    | {
        additionalItems?: JsonSchemaType;
      }
  );

export interface JsonSchemaUndefinedType extends JsonSchemaMetadata {
  not: JsonSchemaAnyType;
}

export type JsonSchemaPrimitive =
  "string" | "number" | "integer" | "boolean" | "null";

export type JsonSchemaUnionType = JsonSchemaMetadata &
  (JsonSchemaPrimitiveUnionType | JsonSchemaAnyOfType);

export type JsonSchemaPrimitiveUnionType = JsonSchemaMetadata &
  (
    | {
        type: JsonSchemaPrimitive | JsonSchemaPrimitive[];
      }
    | {
        type: JsonSchemaPrimitive | JsonSchemaPrimitive[];
        enum: (string | number | bigint | boolean | null)[];
      }
  );

export type JsonSchemaUnknownType = JsonSchemaMetadata & JsonSchemaAnyType;

export interface JsonSchemaAnyOfType extends JsonSchemaMetadata {
  anyOf: JsonSchemaType[];
}

export interface JsonSchemaRefType extends JsonSchemaMetadata {
  $ref: string;
}

export type JsonSchemaTypeUnion =
  | JsonSchemaStringType
  | JsonSchemaArrayType
  | JsonSchemaNumberType
  | JsonSchemaBigintType
  | JsonSchemaBooleanType
  | JsonSchemaDateType
  | JsonSchemaEnumType
  | JsonSchemaLiteralType
  | JsonSchemaNativeEnumType
  | JsonSchemaNullType
  | JsonSchemaNumberType
  | JsonSchemaObjectType
  | JsonSchemaRecordType
  | JsonSchemaTupleType
  | JsonSchemaUnionType
  | JsonSchemaUndefinedType
  | JsonSchemaRefType
  | JsonSchemaNeverType
  | JsonSchemaMapType
  | JsonSchemaAnyType
  | JsonSchemaNullableType
  | JsonSchemaAllOfType
  | JsonSchemaUnknownType
  | JsonSchemaSetType;

/**
 * JSON Schema (draft 2020-12) type that can be used to validate JSON data. It is a union of all the specific JSON Schema types, as well as the metadata properties that can be included in any JSON Schema.
 *
 * @see https://json-schema.org/draft/2020-12
 * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01
 */
export type JsonSchemaType = JsonSchemaTypeUnion & JsonSchemaMetadata;
