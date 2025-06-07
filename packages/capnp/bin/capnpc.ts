#!/usr/bin/env node
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

import {
  writeFatal,
  writeInfo,
  writeSuccess
} from "@storm-software/config-tools/logger/console";
import {
  exitWithError,
  exitWithSuccess,
  findWorkspaceRootSafe,
  handleProcess
} from "@storm-software/config-tools/utilities";
import { listFiles } from "@stryke/fs/list-files";
import { readJsonFile } from "@stryke/fs/read-file";
import { findFilePath } from "@stryke/path/file-path-fns";
import { joinPaths } from "@stryke/path/join-paths";
import type { TsConfigJson } from "@stryke/types/tsconfig";
import { Command, Option } from "commander";
import ts from "typescript";
import { capnpc } from "../src/compile";
import type { CapnpcCLIOptions } from "../src/types";

export function createProgram() {
  writeInfo("⚡ Running Storm Cap'n Proto Compiler Tools", { logLevel: "all" });

  const root = findWorkspaceRootSafe(process.cwd());
  process.env.STORM_WORKSPACE_ROOT ??= root;
  process.env.NX_WORKSPACE_ROOT_PATH ??= root;
  if (root) {
    process.chdir(root);
  }

  const program = new Command("storm-capnpc");
  program.version("1.0.0", "-v --version", "display CLI version");

  const tsOption = new Option(
    "--ts",
    "An indicator to generate TypeScript files"
  ).default(true);

  const jsOption = new Option(
    "--js",
    "An indicator to generate JavaScript files"
  ).default(false);

  const dtsOption = new Option(
    "--dts",
    "An indicator to generate TypeScript declaration files"
  ).default(true);

  const importPathOption = new Option(
    "-I --import-path <dir...>",
    "Add <dir> to the list of directories searched for non-relative imports"
  )
    .default([])
    .argParser((val: string) => {
      if (val.startsWith("-I") || val.startsWith("--import-path")) {
        return val.split(",").map(dir => dir.trim());
      }
      return [val.trim()];
    });

  const generateId = new Option(
    "-i --generate-id",
    "Generate a new 64-bit unique ID for use in a Cap'n Proto schema"
  ).default(true);

  const standardImportOption = new Option(
    "--standard-import",
    "Add default import paths; use only those specified by -I"
  ).default(true);

  const outputPathOption = new Option(
    "-o --output-path <path>",
    "The directory to output the generated files to"
  ).default(process.cwd());

  const sourceOption = new Option(
    "--source-path <path...>",
    "The directories containing the Cap'n Proto schema files to compile (default: current working directory)"
  )
    .default([joinPaths(process.cwd(), "**/*.capnp")])
    .argParser((val: string) => {
      if (val.startsWith("--source") || val.startsWith("-s")) {
        return val.split(",").map(dir => dir.trim());
      }
      return [val.trim()];
    });

  const tsconfigPathOption = new Option(
    "--tsconfig-path <path>",
    "The path to the TypeScript configuration file to use for compilation"
  ).default(joinPaths(process.cwd(), "tsconfig.json"));

  program
    .command("compile", { isDefault: true })
    .description("Run the Storm Cap'n Proto compiler")
    .addOption(sourceOption)
    .addOption(outputPathOption)
    .addOption(importPathOption)
    .addOption(tsconfigPathOption)
    .addOption(generateId)
    .addOption(standardImportOption)
    .addOption(tsOption)
    .addOption(jsOption)
    .addOption(dtsOption)
    .action(compileAction)
    .showSuggestionAfterError(true)
    .showHelpAfterError(true);

  return program;
}

async function compileAction(options: CapnpcCLIOptions) {
  writeInfo(
    `📦 Storm Cap'n Proto Compiler will output ${options.ts ? "TypeScript code" : ""}${
      options.js ? (options.ts ? ", JavaScript code" : "JavaScript code") : ""
    }${
      options.dts
        ? options.ts || options.js
          ? ", TypeScript declarations"
          : "TypeScript declarations"
        : ""
    } files to ${options.outputPath}...`,
    {
      logLevel: "all"
    }
  );

  const resolvedTsconfig = await readJsonFile<TsConfigJson>(
    options.tsconfigPath
  );
  const tsconfig = ts.parseJsonConfigFileContent(
    resolvedTsconfig,
    ts.sys,
    findFilePath(options.tsconfigPath)
  );

  const sourcefiles = [] as string[];
  for (const sourcePath of options.sourcePath) {
    if (!sourcePath) {
      writeFatal(
        `❌ The source path "${sourcePath}" is invalid. Please provide a valid path.`,
        { logLevel: "all" }
      );
      return;
    }

    sourcefiles.push(...(await listFiles(sourcePath)));
  }

  if (sourcefiles.length === 0) {
    writeFatal(
      `❌ No Cap'n Proto schema files found in the specified source paths: ${options.sourcePath.join(
        ", "
      )}. Please ensure that the paths are correct and contain .capnp files.`,
      { logLevel: "all" }
    );
    return;
  }

  const result = await capnpc({
    ...options,
    tsconfig,
    sourcePath: sourcefiles
  });
  if (result.files.size === 0) {
    writeInfo("⚠️ No files were generated. Please check your schema files.", {
      logLevel: "all"
    });
    return;
  }

  writeSuccess("⚡ Storm Cap'n Proto Compiler completed successfully.", {
    logLevel: "all"
  });
}

void (async () => {
  try {
    handleProcess();

    const program = createProgram();
    await program.parseAsync(process.argv);

    exitWithSuccess();
  } catch (error) {
    writeFatal(
      `A fatal error occurred while running the Storm Cap'n Proto compiler tool:
${(error as Error)?.message ? (error as Error).message : JSON.stringify(error)}${
        (error as Error)?.stack
          ? `
Stack Trace: ${(error as Error).stack}`
          : ""
      }`,
      { logLevel: "all" }
    );

    exitWithError();
    process.exit(1);
  }
})();
