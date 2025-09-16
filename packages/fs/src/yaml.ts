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
  DocumentOptions,
  ParseOptions,
  SchemaOptions,
  ToJSOptions
} from "yaml";
import { parse } from "yaml";
import { readFile, readFileSync } from "./read-file";

export type YamlReadOptions = ParseOptions &
  DocumentOptions &
  SchemaOptions &
  ToJSOptions;

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
  return parse(readFileSync(path), options) as T;
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
  options: YamlReadOptions = {}
): Promise<T> {
  return parse(await readFile(path), options) as T;
}
