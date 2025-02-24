/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 License, and is
 free for commercial and private use. For more information, please visit
 our licensing page.

 Website:         https://stormsoftware.com
 Repository:      https://github.com/storm-software/stryke
 Documentation:   https://stormsoftware.com/projects/stryke/docs
 Contact:         https://stormsoftware.com/contact
 License:         https://stormsoftware.com/projects/stryke/license

 ------------------------------------------------------------------- */

import type { ParseError } from "jsonc-parser";
import type { SuperJSONResult } from "superjson";
import type {
  Class,
  JsonParseOptions,
  JsonParserResult,
  JsonSerializeOptions,
  JsonValue
} from "./types";
// import { Decimal } from "decimal.js";
import { isObject } from "@stryke/types/type-checks/is-object";
import { isString } from "@stryke/types/type-checks/is-string";
import { Buffer } from "buffer/";
import { parse } from "jsonc-parser";
import SuperJSON from "superjson";
import { formatParseError } from "./utils/parse-error";
import { stringify } from "./utils/stringify";

/**
 * A static JSON parser class used by Storm Software to serialize and deserialize JSON data
 *
 * @remarks
 * This class uses the [SuperJSON](https://github.com/blitz-js/superjson) library under the hood.
 */
export class StormJSON extends SuperJSON {
  static #instance: StormJSON;

  public static get instance(): StormJSON {
    if (!StormJSON.#instance) {
      StormJSON.#instance = new StormJSON();
    }

    return StormJSON.#instance;
  }

  /**
   * Deserialize the given value with superjson using the given metadata
   */
  public static override deserialize<TData = unknown>(
    payload: JsonParserResult
  ): TData {
    return StormJSON.instance.deserialize(payload);
  }

  /**
   * Serialize the given value with superjson
   *
   *
   */
  public static override serialize(object: JsonValue): JsonParserResult {
    return StormJSON.instance.serialize(object);
  }

  /**
   * Parse the given string value with superjson using the given metadata
   *
   * @param value - The string value to parse
   * @returns The parsed data
   */
  public static override parse<TData = unknown>(value: string): TData {
    return StormJSON.instance.parse(value);
  }

  /**
   * Serializes the given data to a JSON string.
   * By default the JSON string is formatted with a 2 space indentation to be easy readable.
   *
   * @param value - Object which should be serialized to JSON
   * @param options - JSON serialize options
   * @returns the formatted JSON representation of the object
   */
  public static override stringify<T>(value: T, options?: JsonSerializeOptions): string {
    const customTransformer = StormJSON.instance.customTransformerRegistry.findApplicable(value);

    let result = value;
    if (customTransformer) {
      result = customTransformer.serialize(result) as T;
    }

    return stringify((result as SuperJSONResult)?.json
      ? (result as SuperJSONResult)?.json
      : result,
    options?.spaces);
  }

  /**
   * Stringify the given value with superjson
   *
   * @param obj - The object to stringify
   * @returns The stringified object
   */
  public static stringifyBase(obj: any): string {
    return StormJSON.instance.stringify(obj);
  }

  /**
   * Parses the given JSON string and returns the object the JSON content represents.
   * By default javascript-style comments and trailing commas are allowed.
   *
   * @param strData - JSON content as string
   * @param options - JSON parse options
   * @returns Object the JSON content represents
   */
  public static parseJson<TData = unknown>(
    strData: string,
    options?: JsonParseOptions
  ): TData {
    try {
      if (options?.expectComments === false) {
        return StormJSON.instance.parse(strData);
      }
    } catch {
      // Do nothing
    }

    const errors: ParseError[] = [];
    const opts = {
      allowTrailingComma: true,
      ...options
    };
    const result = parse(strData, errors, opts) as TData;

    if (errors.length > 0 && errors[0]) {
      throw new Error(formatParseError(strData, errors[0]));
    }

    return result;
  }

  /**
   * Register a custom schema with superjson
   *
   * @param name - The name of the schema
   * @param serialize - The function to serialize the schema
   * @param deserialize - The function to deserialize the schema
   * @param isApplicable - The function to check if the schema is applicable
   */
  public static register<
    TData = any,
    TJsonObject extends JsonValue = JsonValue
  >(
    name: string,
    serialize: (data: TData) => TJsonObject,
    deserialize: (json: TJsonObject) => TData,
    isApplicable: (data: any) => data is TData
  ) {
    StormJSON.instance.registerCustom<TData, TJsonObject>(
      {
        isApplicable,
        serialize,
        deserialize
      },
      name
    );
  }

  /**
   * Register a class with superjson
   *
   * @param classConstructor - The class constructor to register
   */
  public static override registerClass(
    classConstructor: Class,
    options?: { identifier?: string; allowProps?: string[] } | string
  ) {
    StormJSON.instance.registerClass(classConstructor, {
      identifier: isString(options)
        ? options
        : options?.identifier || classConstructor.name,
      allowProps:
        options &&
        isObject(options) &&
        options?.allowProps &&
        Array.isArray(options.allowProps)
          ? options.allowProps
          : ["__typename"]
    });
  }

  private constructor() {
    super({ dedupe: true });
  }
}

StormJSON.instance.registerCustom<Buffer, string>(
  {
    isApplicable: (v): v is Buffer => Buffer.isBuffer(v),
    serialize: v => v.toString("base64"),
    deserialize: v => Buffer.from(v, "base64")
  },
  "Bytes"
);
