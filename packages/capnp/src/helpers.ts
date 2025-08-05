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

import {
  writeFatal,
  writeWarning
} from "@storm-software/config-tools/logger/console";
import { readJsonFile } from "@stryke/fs/json";
import { listFiles } from "@stryke/fs/list-files";
import { existsSync } from "@stryke/path/exists";
import { findFilePath, relativePath } from "@stryke/path/file-path-fns";
import { joinPaths } from "@stryke/path/join-paths";
import type { TsConfigJson } from "@stryke/types/tsconfig";
import ts from "typescript";
import type { CapnpcCLIOptions, CapnpcOptions } from "./types";

/**
 * Resolves the options for the Cap'n Proto compiler.
 *
 * @param options - The options to resolve
 * @returns The resolved options
 */
export async function resolveOptions(
  options: CapnpcCLIOptions
): Promise<CapnpcOptions | null> {
  const tsconfigPath = options.tsconfig
    ?.replace("{projectRoot}", options.projectRoot)
    ?.replace("{workspaceRoot}", options.workspaceRoot);
  const schema = options.schema
    ? options.schema
        .replace("{projectRoot}", options.projectRoot)
        .replace("{workspaceRoot}", options.workspaceRoot)
    : options.projectRoot;

  if (!existsSync(tsconfigPath)) {
    const errorMessage = options.tsconfig
      ? `✖ The specified TypeScript configuration file "${tsconfigPath}" does not exist. Please provide a valid path.`
      : "✖ The specified TypeScript configuration file does not exist. Please provide a valid path.";
    writeFatal(errorMessage, { logLevel: "all" });

    throw new Error(errorMessage);
  }

  const resolvedTsconfig = await readJsonFile<TsConfigJson>(tsconfigPath);
  const tsconfig = ts.parseJsonConfigFileContent(
    resolvedTsconfig,
    ts.sys,
    findFilePath(tsconfigPath)
  );
  tsconfig.options.configFilePath = tsconfigPath;

  tsconfig.options.noImplicitOverride = false;
  tsconfig.options.noUnusedLocals = false;
  tsconfig.options.noUnusedParameters = false;

  tsconfig.options.outDir = joinPaths(
    options.projectRoot,
    relativePath(
      findFilePath(tsconfigPath),
      joinPaths(
        options.workspaceRoot,
        schema.endsWith(".capnp") ? findFilePath(schema) : schema
      )
    )
  );

  const schemas = [] as string[];
  if (!schema || (!schema.includes("*") && !existsSync(schema))) {
    throw new Error(
      `✖ The schema path "${schema}" is invalid. Please provide a valid path.`
    );
  }

  schemas.push(
    ...(await listFiles(
      schema.includes("*")
        ? schema.endsWith(".capnp")
          ? schema
          : `${schema}.capnp`
        : joinPaths(schema, "**/*.capnp")
    ))
  );

  if (schemas.length === 0) {
    writeWarning(
      `✖ No Cap'n Proto schema files found in the specified source paths: ${schemas.join(
        ", "
      )}. As a result, the Cap'n Proto compiler will not be able to generate any output files. Please ensure that the paths are correct and contain .capnp files.`,
      { logLevel: "all" }
    );

    return null;
  }

  return {
    workspaceRoot: options.workspaceRoot,
    projectRoot: options.projectRoot,
    schemas,
    js: options.js ?? false,
    ts: options.ts ?? (options.noTs !== undefined ? !options.noTs : true),
    dts: options.dts ?? (options.noDts !== undefined ? !options.noDts : true),
    tsconfig: tsconfig?.options
  };
}
