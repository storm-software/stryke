/*-------------------------------------------------------------------

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

 -------------------------------------------------------------------*/

import { StormJSON } from "@stryke/json/storm-json";
import type { JsonSerializeOptions } from "@stryke/json/types";
import type { Abortable } from "node:events";
import {
  type Mode,
  type ObjectEncodingOptions,
  type OpenMode,
  type WriteFileOptions,
  writeFileSync as writeFileSyncFs
} from "node:fs";
import { writeFile as writeFileFs } from "node:fs/promises";
import type { Encoding } from "./constants";

/**
 * Write the given content to the given file path
 *
 * @param filePath - The file path to write to
 * @param content - The content to write to the file
 */
export const writeFileSync = (
  filePath: string,
  content?: any,
  options?: WriteFileOptions
): void => {
  if (!filePath) {
    throw new Error("No file path provided to write data");
  }

  writeFileSyncFs(filePath, content ?? "", options);
};

/**
 * Read the given content to the given file path
 *
 * @param filePath - The file path to read to
 * @param content - The content to write to the file
 * @returns The content of the file
 */
export const writeFile = (
  filePath: string,
  content?: any,
  options?:
    | (ObjectEncodingOptions & {
        mode?: Mode | undefined;
        flag?: OpenMode | undefined;
        flush?: boolean | undefined;
      } & Abortable)
    | Encoding
    | null
): Promise<void> => {
  if (!filePath) {
    throw new Error("No file path provided to read data");
  }

  return writeFileFs(filePath, content ?? "", options);
};

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
  options?: JsonWriteOptions
): void {
  const serializedJson = StormJSON.stringifyJson(data, options);

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
  options?: JsonWriteOptions
): Promise<void> {
  const serializedJson = StormJSON.stringifyJson(data, options);

  return writeFile(
    path,
    options?.appendNewLine ? `${serializedJson}\n` : serializedJson
  );
}
