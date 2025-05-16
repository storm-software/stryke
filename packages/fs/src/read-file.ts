/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/projects/stryke/license.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://stormsoftware.com/projects/stryke/docs
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import { parse as parseToml } from "@ltd/j-toml";
import { StormJSON } from "@stryke/json/storm-json";
import type { JsonParseOptions } from "@stryke/json/types";
import { isError } from "@stryke/type-checks/is-error";
import { existsSync, readFileSync as readFileSyncFs } from "node:fs";
import { readFile as readFileFs } from "node:fs/promises";

/**
 * Read the given content to the given file path
 *
 * @param filePath - The file path to write to
 */
export const readFileSync = (filePath: string): string => {
  try {
    if (!filePath) {
      throw new Error("No file path provided to read data");
    }

    return readFileSyncFs(filePath, { encoding: "utf8" });
  } catch {
    throw new Error("An error occurred writing data to file");
  }
};

/**
 * Read the given content to the given file path
 *
 * @param filePath - The file path to read to
 */
export const readFile = async (filePath: string): Promise<string> => {
  try {
    if (!filePath) {
      throw new Error("No file path provided to read data");
    }

    return await readFileFs(filePath, { encoding: "utf8" });
  } catch {
    throw new Error("An error occurred writing data to file");
  }
};

export interface JsonReadOptions extends JsonParseOptions {
  /**
   * mutable field recording whether JSON ends with new line
   *
   * @defaultValue false
   */
  endsWithNewline?: boolean;
}

/**
 * Reads a JSON file and returns the object the JSON content represents.
 *
 * @param path - A path to a file.
 * @param options - JSON parse options
 * @returns Object the JSON content of the file represents
 */
export function readJsonFileSync<T extends object = any>(
  path: string,
  options?: JsonReadOptions
): T {
  const content = readFileSync(path);
  if (options) {
    options.endsWithNewline = content.codePointAt(content.length - 1) === 10;
  }

  try {
    return StormJSON.parseJson<T>(content, options);
  } catch (error) {
    if (isError(error)) {
      error.message = error.message.replace("JSON", path);
      throw error;
    }

    throw new Error(`Failed to parse JSON: ${path}`);
  }
}

/**
 * Reads a JSON file and returns the object the JSON content represents.
 *
 * @param path - A path to a file.
 * @param options - JSON parse options
 * @returns Object the JSON content of the file represents
 */
export async function readJsonFile<T extends object = any>(
  path: string,
  options?: JsonReadOptions
): Promise<T> {
  const content = await readFile(path);
  if (options) {
    options.endsWithNewline = content.codePointAt(content.length - 1) === 10;
  }

  try {
    return StormJSON.parseJson<T>(content, options);
  } catch (error) {
    if (isError(error)) {
      error.message = error.message.replace("JSON", path);
      throw error;
    }

    throw new Error(`Failed to parse JSON: ${path}`);
  }
}

interface YamlReadOptions {
  /**
   * Compatibility with JSON.parse behavior. If true, then duplicate keys in a mapping will override values rather than throwing an error.
   */
  json?: boolean;
}

/**
 * Reads a YAML file and returns the object the YAML content represents.
 *
 * @param path - A path to a file.
 * @param options - YAML parse options
 * @returns Object the YAML content of the file represents
 */
export function readYamlFileSync<T extends object = any>(
  path: string,
  options?: YamlReadOptions
): T {
  const content = readFileSync(path);
  // eslint-disable-next-line ts/no-require-imports
  const { load } = require("@zkochan/js-yaml");

  // eslint-disable-next-line ts/no-unsafe-call
  return load(content, {
    ...options,
    filename: path
  }) as T;
}

/**
 * Reads a YAML file and returns the object the YAML content represents.
 *
 * @param path - A path to a file.
 * @param options - YAML parse options
 * @returns Object the YAML content of the file represents
 */
export async function readYamlFile<T extends object = any>(
  path: string,
  options?: YamlReadOptions
): Promise<T> {
  const content = await readFile(path);
  // eslint-disable-next-line ts/no-require-imports
  const { load } = require("@zkochan/js-yaml");

  // eslint-disable-next-line ts/no-unsafe-call
  return load(content, {
    ...options,
    filename: path
  }) as T;
}

type XOptions = null | {
  readonly keys?: null | RegExp;
  readonly order?: boolean;
  readonly exact?: boolean;
  readonly multi?: boolean;
  readonly longer?: boolean;
  readonly string?: boolean;
  readonly comment?: boolean;
  readonly literal?: boolean;
  readonly null?: boolean;
  readonly tag?:
    | null
    | (<
        Table extends object & { [key: string | symbol]: any },
        Key extends string | symbol,
        Array extends any[],
        Index extends number,
        Tag extends string
      >(
        this: void,
        each:
          | { table: Table; key: Key; tag: Tag }
          | { array: Array; index: Index; tag: Tag }
          | { table: Table; key: Key; array: Array; index: Index; tag: Tag }
      ) => void);
};

interface TomlReadOptions {
  specificationVersion?: 1.0 | 0.5 | 0.4 | 0.3 | 0.2 | 0.1;
  multilineStringJoiner?: string;
  useBigInt?: boolean | number;
  xOptions?: XOptions;
}

/**
 * Reads a TOML file and returns the object the TOML content represents.
 *
 * @param path - A path to a file.
 * @param options - TOML parse options
 * @returns Object the TOML content of the file represents
 */
export function readTomlFileSync<T extends object = any>(
  path: string,
  options?: TomlReadOptions
): T {
  const content = readFileSync(path);

  return (
    options?.specificationVersion
      ? parseToml(
          content,
          options.specificationVersion,
          options?.multilineStringJoiner,
          options?.useBigInt,
          options?.xOptions
        )
      : parseToml(content)
  ) as T;
}

/**
 * Reads a TOML file and returns the object the TOML content represents.
 *
 * @param path - A path to a file.
 * @param options - TOML parse options
 * @returns Object the TOML content of the file represents
 */
export async function readTomlFile<T extends object = any>(
  path: string,
  options?: TomlReadOptions
): Promise<T> {
  const content = await readFile(path);

  return (
    options?.specificationVersion
      ? parseToml(
          content,
          options.specificationVersion,
          options?.multilineStringJoiner,
          options?.useBigInt,
          options?.xOptions
        )
      : parseToml(content)
  ) as T;
}

/**
 * Reads a file if it exists, otherwise returns an empty string.
 *
 * @param path - The path to the file to read.
 * @returns The content of the file if it exists, otherwise an empty string.
 */
export function readFileIfExistingSync(path: string) {
  return existsSync(path) ? readFileSync(path) : "";
}

/**
 * Reads a file if it exists, otherwise returns an empty string.
 *
 * @param path - The path to the file to read.
 * @returns The content of the file if it exists, otherwise an empty string.
 */
export async function readFileIfExisting(path: string) {
  return existsSync(path) ? readFile(path) : "";
}
