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
  writeInfo,
  writeWarning
} from "@storm-software/config-tools/logger/console";
import { toArray } from "@stryke/convert/to-array";
import { createDirectory, isFile } from "@stryke/fs";
import { existsSync } from "@stryke/fs/exists";
import { readJsonFile } from "@stryke/fs/json";
import { listFiles, listSync } from "@stryke/fs/list-files";
import { appendPath } from "@stryke/path/append";
import { findFilePath, relativePath } from "@stryke/path/file-path-fns";
import { joinPaths } from "@stryke/path/join-paths";
import type { TsConfigJson } from "@stryke/types/tsconfig";
import type { ParsedCommandLine } from "typescript";
import { parseJsonConfigFileContent, sys } from "typescript";
import type { CapnpcOptions, CapnpcResolvedOptions } from "./types.js";

/**
 * Resolves the options for the Cap'n Proto compiler.
 *
 * @param options - The options to resolve
 * @returns The resolved options
 */
export async function resolveOptions(
  options: Omit<CapnpcOptions, "workspaceRoot" | "projectRoot"> &
    Required<Pick<CapnpcOptions, "workspaceRoot" | "projectRoot">>
): Promise<CapnpcResolvedOptions | null> {
  const tsconfigPath = options.tsconfigPath
    ? options.tsconfigPath
        .replace("{projectRoot}", options.projectRoot)
        .replace("{workspaceRoot}", options.workspaceRoot)
    : joinPaths(options.projectRoot, "tsconfig.json");

  const schemas = [] as string[];
  if (options.schemas) {
    schemas.push(
      ...toArray(options.schemas)
        .filter(Boolean)
        .map(schema =>
          schema
            .replace("{projectRoot}", options.projectRoot)
            .replace("{workspaceRoot}", options.workspaceRoot)
        )
        .map(schema =>
          schema.includes("*") ||
          schema.endsWith(".capnp") ||
          (existsSync(schema) &&
            listSync(joinPaths(schema, "**/*.capnp")).length > 0)
            ? schema
            : existsSync(joinPaths(options.projectRoot, schema)) &&
                listSync(joinPaths(options.projectRoot, schema, "**/*.capnp"))
                  .length > 0
              ? joinPaths(options.projectRoot, schema, "**/*.capnp")
              : existsSync(joinPaths(options.workspaceRoot, schema)) &&
                  listSync(
                    joinPaths(options.workspaceRoot, schema, "**/*.capnp")
                  ).length > 0
                ? joinPaths(options.workspaceRoot, schema, "**/*.capnp")
                : schema
        )
    );
  } else {
    schemas.push(
      existsSync(joinPaths(options.projectRoot, "schemas/**/*.capnp")) &&
        listSync(joinPaths(options.projectRoot, "schemas/**/*.capnp")).length >
          0
        ? joinPaths(options.projectRoot, "schemas/**/*.capnp")
        : existsSync(joinPaths(options.workspaceRoot, "schemas/**/*.capnp")) &&
            listSync(joinPaths(options.workspaceRoot, "schemas/**/*.capnp"))
              .length > 0
          ? joinPaths(options.workspaceRoot, "schemas/**/*.capnp")
          : "schemas/**/*.capnp"
    );
  }

  let resolvedTsconfig!: ParsedCommandLine;
  if (options.tsconfig) {
    resolvedTsconfig = options.tsconfig;
  } else {
    let resolvedTsconfigPath = tsconfigPath;
    if (!existsSync(resolvedTsconfigPath)) {
      const found = [
        joinPaths(options.projectRoot, "tsconfig.json"),
        joinPaths(options.projectRoot, "tsconfig.lib.json"),
        joinPaths(options.projectRoot, "tsconfig.app.json"),
        joinPaths(options.projectRoot, "tsconfig.capnp.json"),
        joinPaths(options.projectRoot, "tsconfig.schema.json"),
        joinPaths(options.workspaceRoot, "tsconfig.json"),
        joinPaths(options.workspaceRoot, "tsconfig.lib.json"),
        joinPaths(options.workspaceRoot, "tsconfig.app.json"),
        joinPaths(options.workspaceRoot, "tsconfig.capnp.json"),
        joinPaths(options.workspaceRoot, "tsconfig.schema.json")
      ].find(path => existsSync(path));
      if (found) {
        resolvedTsconfigPath = found;
      }
    }

    if (!resolvedTsconfigPath || !existsSync(resolvedTsconfigPath)) {
      const errorMessage = tsconfigPath
        ? `✖ The specified TypeScript configuration file "${
            tsconfigPath
          }" does not exist. Please provide a valid path.`
        : "✖ The specified TypeScript configuration file does not exist. Please provide a valid path.";
      writeFatal(errorMessage, { logLevel: "all" });

      throw new Error(errorMessage);
    }

    const tsconfigFile = await readJsonFile<TsConfigJson>(tsconfigPath);
    resolvedTsconfig = parseJsonConfigFileContent(
      tsconfigFile,
      sys,
      findFilePath(tsconfigPath)
    );
    if (!resolvedTsconfig) {
      const errorMessage = `✖ The specified TypeScript configuration file "${
        tsconfigPath
      }" is invalid. Please provide a valid configuration.`;
      writeFatal(errorMessage, { logLevel: "all" });

      throw new Error(errorMessage);
    }

    resolvedTsconfig.options.configFilePath = tsconfigPath;
    resolvedTsconfig.options.noImplicitOverride = false;
    resolvedTsconfig.options.noUnusedLocals = false;
    resolvedTsconfig.options.noUnusedParameters = false;
  }

  const resolvedSchemas = [] as string[];
  for (const schema of schemas) {
    let formattedSchema = schema;
    if (!schema.endsWith(".capnp") && !schema.includes("*")) {
      formattedSchema = `${schema.replace(/\/$/g, "")}/*.capnp`;
    }

    resolvedSchemas.push(...(await listFiles(formattedSchema)));
  }

  if (resolvedSchemas.length === 0 || !resolvedSchemas[0]) {
    writeWarning(
      `✖ No Cap'n Proto schema files found in the specified source paths: ${schemas.join(
        ", "
      )}. As a result, the Cap'n Proto compiler will not be able to generate any output files. Please ensure that the paths are correct and contain .capnp files.`,
      { logLevel: "all" }
    );

    return null;
  }

  const output = options.output
    ? options.output
        .replace("{projectRoot}", options.projectRoot)
        .replace("{workspaceRoot}", options.workspaceRoot)
    : appendPath(
        relativePath(
          tsconfigPath ? findFilePath(tsconfigPath) : options.projectRoot,
          appendPath(
            resolvedSchemas[0].endsWith(".capnp")
              ? findFilePath(resolvedSchemas[0])
              : resolvedSchemas[0],
            options.workspaceRoot
          )
        ),
        options.projectRoot
      );
  if (!existsSync(output)) {
    if (isFile(output)) {
      const errorMessage = `✖ The specified output path "${
        output
      }" is a file. Please provide a valid directory path.`;
      writeFatal(errorMessage, { logLevel: "all" });

      throw new Error(errorMessage);
    }

    writeInfo(
      `Output directory "${
        output
      }" does not exist. It will be created automatically.`,
      {
        logLevel: "all"
      }
    );

    await createDirectory(output);
  }

  resolvedTsconfig.options.outDir = output;

  return {
    ...options,
    importPath: options.importPath
      ? options.importPath.split(",").map(dir => dir.trim())
      : [],
    workspaceRoot: options.workspaceRoot,
    projectRoot: options.projectRoot,
    schemas: resolvedSchemas,
    output,
    js: options.js === true,
    ts: options.noTs !== true,
    dts: options.dts ?? options.noDts !== true,
    tsconfig: resolvedTsconfig
  };
}
