#!/usr/bin/env node
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
  writeSuccess,
  writeWarning
} from "@storm-software/config-tools/logger/console";
import {
  exitWithError,
  exitWithSuccess,
  findWorkspaceRootSafe,
  handleProcess
} from "@storm-software/config-tools/utilities";
import { existsSync } from "@stryke/path/exists";
import { findFilePath } from "@stryke/path/file-path-fns";
import { joinPaths } from "@stryke/path/join-paths";
import { Command, Option } from "commander";
import { writeFile } from "node:fs/promises";
import { capnpc } from "../src/compile.js";
import { resolveOptions } from "../src/helpers.js";
import type { CapnpcCLIOptions } from "../src/types.js";

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

  const projectRootOption = new Option(
    "-p --project-root <path>",
    "The path to the project root directory"
  );

  const tsOption = new Option(
    "--ts",
    "An indicator to generate TypeScript files"
  ).default(true);

  const noTsOption = new Option(
    "--no-ts",
    "An indicator to disable generation of TypeScript files"
  );

  const jsOption = new Option(
    "--js",
    "An indicator to generate JavaScript files"
  ).default(false);

  const dtsOption = new Option(
    "--dts",
    "An indicator to generate TypeScript declaration files"
  );

  const noDtsOption = new Option(
    "--no-dts",
    "An indicator to disable generation of TypeScript declaration files"
  );

  const ttyOption = new Option(
    "--tty",
    "An indicator to enable TTY mode for the compiler"
  );

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

  const schemaOption = new Option(
    "-s --schema <path>",
    "The directory (or a glob to the directory) containing the Cap'n Proto schema files to compile (default: current working directory)"
  ).default(joinPaths("{projectRoot}", "**/*.capnp"));

  const outputOption = new Option(
    "-o --output <path>",
    "The directory to output the generated files to"
  );

  const tsconfigOption = new Option(
    "--tsconfig <path>",
    "The path to the TypeScript configuration file to use for compilation"
  ).default(joinPaths("{projectRoot}", "tsconfig.json"));

  const workspaceRootOption = new Option(
    "-w --workspace-root <path>",
    "The path to the workspace root directory"
  ).default(root);

  program
    .command("compile", { isDefault: true })
    .description("Run the Storm Cap'n Proto compiler")
    .addOption(projectRootOption)
    .addOption(schemaOption)
    .addOption(outputOption)
    .addOption(importPathOption)
    .addOption(tsconfigOption)
    .addOption(generateId)
    .addOption(standardImportOption)
    .addOption(tsOption)
    .addOption(noTsOption)
    .addOption(jsOption)
    .addOption(dtsOption)
    .addOption(noDtsOption)
    .addOption(workspaceRootOption)
    .addOption(ttyOption)
    .action(compileAction)
    .showSuggestionAfterError(true)
    .showHelpAfterError(true);

  return program;
}

async function compileAction(options: CapnpcCLIOptions) {
  const resolvedOptions = await resolveOptions({
    ...options,
    projectRoot: options.projectRoot,
    tsconfig: undefined,
    tsconfigPath:
      options.tsconfig || joinPaths(options.projectRoot, "tsconfig.json"),
    schemas: options.schema
  });
  if (!resolvedOptions) {
    writeWarning(
      "✖ Unable to resolve Cap'n Proto compiler options - the program will terminate",
      { logLevel: "all" }
    );
    return;
  }

  writeInfo(
    `📦  Storm Cap'n Proto Compiler will output ${
      resolvedOptions.ts ? "TypeScript code" : ""
    }${
      resolvedOptions.js
        ? resolvedOptions.ts
          ? ", JavaScript code"
          : "JavaScript code"
        : ""
    }${
      resolvedOptions.dts
        ? resolvedOptions.ts || resolvedOptions.js
          ? ", TypeScript declarations"
          : "TypeScript declarations"
        : ""
    } files from schemas at ${
      options.schema
        ? options.schema
            .replace("{projectRoot}", resolvedOptions.projectRoot)
            .replace("{workspaceRoot}", resolvedOptions.workspaceRoot)
        : resolvedOptions.projectRoot
    } to ${resolvedOptions.tsconfig.options.outDir}...`,
    {
      logLevel: "all"
    }
  );

  const result = await capnpc(resolvedOptions);
  if (result.files.size === 0) {
    writeWarning(
      "⚠️  No files were generated. Please check your schema files.",
      {
        logLevel: "all"
      }
    );
    return;
  }

  writeInfo(`📋  Writing ${result.files.size} generated files to disk...`, {
    logLevel: "all"
  });

  for (const [fileName, content] of result.files) {
    let filePath = fileName;
    if (!existsSync(findFilePath(filePath))) {
      const fullPath = `/${filePath}`;
      if (existsSync(findFilePath(fullPath))) {
        filePath = fullPath;
      }
    }

    if (options.output) {
      filePath = joinPaths(options.output, fileName);
      if (!existsSync(findFilePath(options.output))) {
        writeWarning(
          `Output directory "${findFilePath(options.output)}" does not exist, it will be created...`
        );
        // await createDirectory(
        //   replacePath(findFilePath(options.output), getWorkspaceRoot())
        // );
      }
    }

    await writeFile(
      filePath,
      // https://github.com/microsoft/TypeScript/issues/54632
      content.replace(/^\s+/gm, match => " ".repeat(match.length / 2))
    );
  }

  writeSuccess("⚡  Storm Cap'n Proto Compiler completed successfully.", {
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
      `✖ A fatal error occurred while running the Storm Cap'n Proto compiler tool:
${(error as Error)?.message ? ((error as Error)?.name ? `[${(error as Error).name}]: ${(error as Error).message}` : (error as Error).message) : JSON.stringify(error)}${
        (error as Error)?.stack
          ? `

Stack Trace: ${(error as Error).stack}`
          : ""
      }`,
      { logLevel: "all" }
    );

    exitWithError();
  }
})();
