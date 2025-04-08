/* -------------------------------------------------------------------

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

 ------------------------------------------------------------------- */

import { isFunction } from "@stryke/type-checks/is-function";
import { parseArgs, resolveValue } from "./parse";
import type { ArgsDef, CommandContext, CommandDef } from "./types";

export interface RunCommandOptions {
  rawArgs: string[];
  data?: any;
  showUsage?: boolean;
}

export async function runCommand<T extends ArgsDef = ArgsDef>(
  cmd: CommandDef<T>,
  opts: RunCommandOptions
): Promise<{ result: unknown }> {
  const cmdArgs = await resolveValue(cmd.args ?? {});
  const parsedArgs = parseArgs<T>(opts.rawArgs, cmdArgs);

  const context: CommandContext<T> = {
    rawArgs: opts.rawArgs,
    args: parsedArgs,
    data: opts.data,
    cmd
  };

  // Setup hook
  if (isFunction(cmd.setup)) {
    await cmd.setup(context);
  }

  // Handle sub command
  let result: unknown;
  try {
    const subCommands = await resolveValue(cmd.subCommands);
    if (subCommands && Object.keys(subCommands).length > 0) {
      const subCommandArgIndex = opts.rawArgs.findIndex(
        arg => !arg.startsWith("-")
      );
      const subCommandName = opts.rawArgs[subCommandArgIndex];
      if (subCommandName) {
        if (!subCommands[subCommandName]) {
          throw new Error(`Unknown command \`${subCommandName}\``);
        }
        const subCommand = await resolveValue(subCommands[subCommandName]);
        if (subCommand) {
          await runCommand(subCommand, {
            rawArgs: opts.rawArgs.slice(subCommandArgIndex + 1)
          });
        }
      } else if (!cmd.run) {
        throw new Error(`No command specified.`);
      }
    }

    // Handle main command
    if (isFunction(cmd.run)) {
      result = await cmd.run(context);
    }
  } finally {
    if (isFunction(cmd.cleanup)) {
      await cmd.cleanup(context);
    }
  }

  return { result };
}
