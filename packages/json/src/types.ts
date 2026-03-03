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
  | PrimitiveTypeAnnotation
  | "regexp"
  | "Date"
  | "Error"
  | "URL";

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
      | Tree<TypeAnnotation>
      | Record<string, Tree<TypeAnnotation>>
      | undefined;
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

export interface JsonSchema7Metadata {
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
    [key: string]: JsonSchema7Type;
  };

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

export interface JsonSchema7AnyType extends JsonSchema7Metadata {
  $ref?: string;
}

export interface JsonSchema7ArrayType extends JsonSchema7Metadata {
  type: "array";
  items?: JsonSchema7Type;
  minItems?: number;
  maxItems?: number;
}

export interface JsonSchema7BigintType extends JsonSchema7Metadata {
  type: "integer";
  format: "int64";
  minimum?: bigint;
  exclusiveMinimum?: bigint;
  maximum?: bigint;
  exclusiveMaximum?: bigint;
  multipleOf?: bigint;
}

export interface JsonSchema7BooleanType extends JsonSchema7Metadata {
  type: "boolean";
}

export type JsonSchema7DateType = JsonSchema7Metadata &
  (
    | {
        type: "integer" | "string";
        format: "unix-time" | "date-time" | "date";
        minimum?: number;
        maximum?: number;
      }
    | {
        anyOf: JsonSchema7DateType[];
      }
  );

export interface JsonSchema7EnumType extends JsonSchema7Metadata {
  type: "string";
  enum: string[];
}

export interface JsonSchema7AllOfType extends JsonSchema7Metadata {
  allOf: JsonSchema7Type[];
  unevaluatedProperties?: boolean;
}

export interface JsonSchema7PrimitiveLiteralType extends JsonSchema7Metadata {
  type: "string" | "number" | "integer" | "boolean";
  const: string | number | boolean;
}

export type JsonSchema7LiteralType = JsonSchema7Metadata &
  (
    | JsonSchema7PrimitiveLiteralType
    | {
        type: "object" | "array";
      }
  );

export interface JsonSchema7MapType extends JsonSchema7Metadata {
  type: "array";
  maxItems: 125;
  items: {
    type: "array";
    items: [JsonSchema7Type, JsonSchema7Type];
    minItems: 2;
    maxItems: 2;
  };
}

export interface JsonSchema7NativeEnumType extends JsonSchema7Metadata {
  type: "string" | "number" | ["string", "number"];
  enum: (string | number)[];
}

export interface JsonSchema7NeverType extends JsonSchema7Metadata {
  not: JsonSchema7AnyType;
}

export interface JsonSchema7NullType extends JsonSchema7Metadata {
  type: "null";
}

export type JsonSchema7NullableType = JsonSchema7Metadata &
  (
    | {
        anyOf: [JsonSchema7Type, JsonSchema7NullType];
      }
    | {
        type: [string, "null"];
      }
  );

export interface JsonSchema7NumberType extends JsonSchema7Metadata {
  type: "number" | "integer";
  minimum?: number;
  exclusiveMinimum?: number;
  maximum?: number;
  exclusiveMaximum?: number;
  multipleOf?: number;
}

export interface JsonSchema7ObjectType extends JsonSchema7Metadata {
  type: "object";
  properties: Record<string, JsonSchema7Type>;
  additionalProperties?: boolean | JsonSchema7Type;
  required?: string[];
}

export interface JsonSchema7StringType extends JsonSchema7Metadata {
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

export interface JsonSchema7SetType extends JsonSchema7Metadata {
  type: "array";
  uniqueItems: true;
  items?: JsonSchema7Type;
  minItems?: number;
  maxItems?: number;
}

export type JsonSchema7RecordPropertyNamesType = JsonSchema7Metadata &
  (Omit<JsonSchema7StringType, "type"> | Omit<JsonSchema7EnumType, "type">);

export interface JsonSchema7RecordType extends JsonSchema7Metadata {
  type: "object";
  additionalProperties?: JsonSchema7Type | true;
  propertyNames?: JsonSchema7RecordPropertyNamesType;
}

export type JsonSchema7TupleType = JsonSchema7Metadata & {
  type: "array";
  minItems: number;
  items: JsonSchema7Type[];
} & (
    | {
        maxItems: number;
      }
    | {
        additionalItems?: JsonSchema7Type;
      }
  );

export interface JsonSchema7UndefinedType extends JsonSchema7Metadata {
  not: JsonSchema7AnyType;
}

export type JsonSchema7Primitive =
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "null";

export type JsonSchema7UnionType = JsonSchema7Metadata &
  (JsonSchema7PrimitiveUnionType | JsonSchema7AnyOfType);

export type JsonSchema7PrimitiveUnionType = JsonSchema7Metadata &
  (
    | {
        type: JsonSchema7Primitive | JsonSchema7Primitive[];
      }
    | {
        type: JsonSchema7Primitive | JsonSchema7Primitive[];
        enum: (string | number | bigint | boolean | null)[];
      }
  );

export type JsonSchema7UnknownType = JsonSchema7Metadata & JsonSchema7AnyType;

export interface JsonSchema7AnyOfType extends JsonSchema7Metadata {
  anyOf: JsonSchema7Type[];
}

export interface JsonSchema7RefType extends JsonSchema7Metadata {
  $ref: string;
}

export type JsonSchema7TypeUnion =
  | JsonSchema7StringType
  | JsonSchema7ArrayType
  | JsonSchema7NumberType
  | JsonSchema7BigintType
  | JsonSchema7BooleanType
  | JsonSchema7DateType
  | JsonSchema7EnumType
  | JsonSchema7LiteralType
  | JsonSchema7NativeEnumType
  | JsonSchema7NullType
  | JsonSchema7NumberType
  | JsonSchema7ObjectType
  | JsonSchema7RecordType
  | JsonSchema7TupleType
  | JsonSchema7UnionType
  | JsonSchema7UndefinedType
  | JsonSchema7RefType
  | JsonSchema7NeverType
  | JsonSchema7MapType
  | JsonSchema7AnyType
  | JsonSchema7NullableType
  | JsonSchema7AllOfType
  | JsonSchema7UnknownType
  | JsonSchema7SetType;

/**
 * JSON Schema v7
 * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01
 */
export type JsonSchema7Type = JsonSchema7TypeUnion & JsonSchema7Metadata;
