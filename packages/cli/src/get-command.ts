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

import { detect, getCommand as getCommandBase } from "@antfu/ni";
import type { CLICommandType, ResolvedCommand } from "./types";

/**
 * Get the details of a CLI command for execution
 *
 * @remarks
 * This function is a wrapper around the \@antfu/ni command to run CLI commands
 *
 * @param command - The command to execute
 * @param args - The arguments to pass to the command
 * @param cwd - The current working directory to use when executing the command
 * @returns The result of the command or an exception
 */
export const getCommand = async (
  command: CLICommandType = "execute",
  args: string[] = [],
  cwd?: string
): Promise<ResolvedCommand> => {
  return getCommandBase(
    (await detect({
      autoInstall: true,
      cwd,
      programmatic: true
    })) ?? "npm",
    command,
    args
  );
};
