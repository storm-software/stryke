/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/projects/stryke/license.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://docs.stormsoftware.com/projects/stryke
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import { existsSync } from "@stryke/path/exists";
import { findFilePath } from "@stryke/path/file-path-fns";
import { joinPaths } from "@stryke/path/join-paths";
import type { TsConfigJson } from "@stryke/types/tsconfig";
import defu from "defu";
import { resolvePath } from "mlly";
import { readJsonFile } from "./json";

/**
 * Loads a tsconfig.json file and returns the parsed JSON object.
 *
 * @param filePath - The directory to start searching for the tsconfig.json file.
 * @returns The parsed tsconfig.json object or null if not found.
 */
export async function loadTsConfig(
  filePath: string = process.cwd()
): Promise<TsConfigJson> {
  let tsconfigFilePath = filePath.endsWith(".json")
    ? filePath
    : joinPaths(filePath, "tsconfig.json");
  if (!existsSync(tsconfigFilePath)) {
    tsconfigFilePath = await resolvePath(filePath, { url: import.meta.url });
    if (!existsSync(tsconfigFilePath)) {
      throw new Error(
        `tsconfig.json not found at ${tsconfigFilePath}. Please ensure the file exists.`
      );
    }
  }

  let config = await readJsonFile<TsConfigJson>(tsconfigFilePath);
  if (config?.compilerOptions?.baseUrl) {
    config.compilerOptions.baseUrl = joinPaths(
      findFilePath(tsconfigFilePath),
      config.compilerOptions.baseUrl
    );
  }

  if (config?.extends) {
    const extendsList = Array.isArray(config.extends)
      ? config.extends
      : [config.extends];

    for (const extendsName of extendsList) {
      const parentConfig = await loadTsConfig(
        joinPaths(findFilePath(tsconfigFilePath), extendsName)
      );
      if (parentConfig) {
        config = defu(config, parentConfig ?? {});
      }
    }
  }

  config.extends = undefined;
  return config;
}
