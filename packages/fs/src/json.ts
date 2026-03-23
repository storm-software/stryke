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

import { StormJSON } from "@stryke/json/storm-json";
import type {
  JsonParseOptions,
  JsonSerializeOptions
} from "@stryke/json/types";
import { findFileExtension } from "@stryke/path";
import { isSetString } from "@stryke/type-checks";
import { isError } from "@stryke/type-checks/is-error";
import { readFile, readFileSync } from "./read-file";
import { writeFile, writeFileSync } from "./write-file";

/**
 * Reads a JSON file and returns the object the JSON content represents.
 *
 * @param path - A path to a file.
 * @param options - JSON parse options
 * @returns Object the JSON content of the file represents
 */
export function readJsonFileSync<T extends object = any>(
  path: string,
  options?: JsonParseOptions
): T {
  const content = readFileSync(path);

  try {
    return StormJSON.parse<T>(isSetString(content) ? content.trim() : "{}", {
      expectComments: findFileExtension(path) === "jsonc",
      ...options
    });
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
  options: JsonParseOptions = {}
): Promise<T> {
  const content = await readFile(path);

  try {
    return StormJSON.parse<T>(isSetString(content) ? content.trim() : "{}", {
      expectComments: findFileExtension(path) === "jsonc",
      ...options
    });
  } catch (error) {
    if (isError(error)) {
      error.message = error.message.replace("JSON", path);
      throw error;
    }

    throw new Error(`Failed to parse JSON: ${path}`);
  }
}

export interface JsonWriteOptions extends JsonSerializeOptions {
  /**
   * whether to append new line at the end of JSON file
   *
   * @defaultValue false
   */
  appendNewLine?: boolean;
}

/**
 * Serializes the given data to JSON and writes it to a file.
 *
 * @param path - A path to a file.
 * @param data - data which should be serialized to JSON and written to the file
 * @param options - JSON serialize options
 */
export function writeJsonFileSync<T extends object = object>(
  path: string,
  data: T,
  options: JsonWriteOptions = {}
): void {
  const serializedJson = StormJSON.stringify(data, { spaces: 2, ...options });

  return writeFileSync(
    path,
    options?.appendNewLine ? `${serializedJson}\n` : serializedJson
  );
}

/**
 * Serializes the given data to JSON and writes it to a file asynchronously.
 *
 * @param path - A path to a file.
 * @param data - data which should be serialized to JSON and written to the file
 * @param options - JSON serialize options
 */
export async function writeJsonFile<T extends object = object>(
  path: string,
  data: T,
  options: JsonWriteOptions = {}
): Promise<void> {
  const serializedJson = StormJSON.stringify(data, { spaces: 2, ...options });

  return writeFile(
    path,
    options?.appendNewLine ? `${serializedJson}\n` : serializedJson
  );
}
