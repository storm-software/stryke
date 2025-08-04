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

import { execaCommand } from "execa";
import { getCommand } from "./get-command";

/**
 * Execute a CLI command
 *
 * @remarks
 * This function is a wrapper around the execa command to run CLI commands
 *
 * @param command - The command to execute
 * @param cwd - The current working directory to use when executing the command
 * @returns The result of the command or an exception
 */
export const execute = async (command: string, cwd: string = process.cwd()) => {
  return execaCommand(command, {
    preferLocal: true,
    shell: true,
    stdio: "inherit",
    cwd
  });
};

/**
 * Execute a package command
 *
 * @param packageName - The name of the package to execute
 * @param args - The arguments to pass to the command
 * @param cwd - The current working directory to use when executing the command
 * @returns The result of the command or an exception
 */
export const executePackage = async (
  packageName: string,
  args: string[] = [],
  cwd?: string
) => {
  const result = await getCommand("execute", [packageName, ...args], cwd);

  return execute(`${result.command} ${result.args.join(" ")}`, cwd);
};
