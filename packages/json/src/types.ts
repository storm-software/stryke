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

export interface JsonSchema7AnyType {
  $ref?: string;
}

export interface JsonSchema7ArrayType {
  type: "array";
  items?: JsonSchema7Type;
  minItems?: number;
  maxItems?: number;
}

export interface JsonSchema7BigintType {
  type: "integer";
  format: "int64";
  minimum?: bigint;
  exclusiveMinimum?: bigint;
  maximum?: bigint;
  exclusiveMaximum?: bigint;
  multipleOf?: bigint;
}

export interface JsonSchema7BooleanType {
  type: "boolean";
}

export type JsonSchema7DateType =
  | {
      type: "integer" | "string";
      format: "unix-time" | "date-time" | "date";
      minimum?: number;
      maximum?: number;
    }
  | {
      anyOf: JsonSchema7DateType[];
    };

export interface JsonSchema7EnumType {
  type: "string";
  enum: string[];
}

export interface JsonSchema7AllOfType {
  allOf: JsonSchema7Type[];
  unevaluatedProperties?: boolean;
}

export interface JsonSchema7PrimitiveLiteralType {
  type: "string" | "number" | "integer" | "boolean";
  const: string | number | boolean;
}

export type JsonSchema7LiteralType =
  | JsonSchema7PrimitiveLiteralType
  | {
      type: "object" | "array";
    };

export interface JsonSchema7MapType {
  type: "array";
  maxItems: 125;
  items: {
    type: "array";
    items: [JsonSchema7Type, JsonSchema7Type];
    minItems: 2;
    maxItems: 2;
  };
}

export interface JsonSchema7NativeEnumType {
  type: "string" | "number" | ["string", "number"];
  enum: (string | number)[];
}

export interface JsonSchema7NeverType {
  not: JsonSchema7AnyType;
}

export interface JsonSchema7NullType {
  type: "null";
}

export type JsonSchema7NullableType =
  | {
      anyOf: [JsonSchema7Type, JsonSchema7NullType];
    }
  | {
      type: [string, "null"];
    };

export interface JsonSchema7NumberType {
  type: "number" | "integer";
  minimum?: number;
  exclusiveMinimum?: number;
  maximum?: number;
  exclusiveMaximum?: number;
  multipleOf?: number;
}

export interface JsonSchema7ObjectType {
  type: "object";
  properties: Record<string, JsonSchema7Type>;
  additionalProperties?: boolean | JsonSchema7Type;
  required?: string[];
}

export interface JsonSchema7StringType {
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

export interface JsonSchema7SetType {
  type: "array";
  uniqueItems: true;
  items?: JsonSchema7Type;
  minItems?: number;
  maxItems?: number;
}

export type JsonSchema7RecordPropertyNamesType =
  | Omit<JsonSchema7StringType, "type">
  | Omit<JsonSchema7EnumType, "type">;

export interface JsonSchema7RecordType {
  type: "object";
  additionalProperties?: JsonSchema7Type | true;
  propertyNames?: JsonSchema7RecordPropertyNamesType;
}

export type JsonSchema7TupleType = {
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

export interface JsonSchema7UndefinedType {
  not: JsonSchema7AnyType;
}

export type JsonSchema7Primitive =
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "null";

export type JsonSchema7UnionType =
  | JsonSchema7PrimitiveUnionType
  | JsonSchema7AnyOfType;

export type JsonSchema7PrimitiveUnionType =
  | {
      type: JsonSchema7Primitive | JsonSchema7Primitive[];
    }
  | {
      type: JsonSchema7Primitive | JsonSchema7Primitive[];
      enum: (string | number | bigint | boolean | null)[];
    };

export type JsonSchema7UnknownType = JsonSchema7AnyType;

export interface JsonSchema7AnyOfType {
  anyOf: JsonSchema7Type[];
}

export interface JsonSchema7RefType {
  $ref: string;
}

export interface JsonSchema7Meta {
  $id?: string;
  $ref?: string;
  $schema?: string;
  $comment?: string;

  title?: string;
  default?: any;
  description?: string;
  markdownDescription?: string;

  /**
   * @see https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-00#section-8.2.4
   * @see https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-validation-00#appendix-A
   */
  $defs?: {
    [key: string]: JsonSchema7Type;
  };
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
export type JsonSchema7Type = JsonSchema7TypeUnion & JsonSchema7Meta;
