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

import { isFunction } from "@stryke/type-checks/is-function";
import { parseArgs, resolveValue } from "./parse";
import type { ArgsDef, CommandContext, CommandDef, ParsedArgs } from "./types";

export interface RunCommandOptions<TArgs extends ArgsDef = ArgsDef> {
  rawArgs: string[];
  args?: ParsedArgs<TArgs>;
  data?: any;
  showUsage?: boolean;
}

export async function runCommand<TArgs extends ArgsDef = ArgsDef>(
  command: CommandDef<TArgs>,
  opts: RunCommandOptions<TArgs>
): Promise<{ result: unknown }> {
  const cmdArgs = await resolveValue(command.args ?? {});

  let args = opts.args;
  args ??= parseArgs<TArgs>(opts.rawArgs, cmdArgs);

  const context: CommandContext<TArgs> = {
    rawArgs: opts.rawArgs,
    args,
    data: opts.data,
    command
  };

  // Setup hook
  if (isFunction(command.setup)) {
    await Promise.resolve(command.setup(context));
  }

  // Handle sub command
  let result: unknown;
  try {
    const subCommands = await resolveValue(command.subCommands);
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
      } else if (!command.handle) {
        const meta = await resolveValue(command.meta);
        throw new Error(
          `No command handler specified${meta?.name || meta?.displayName ? ` for \`${meta.name || meta?.displayName}\`` : ""}.`
        );
      }
    }

    // Handle main command
    if (isFunction(command.handle)) {
      result = await Promise.resolve(command.handle(context));
    }
  } finally {
    if (isFunction(command.cleanup)) {
      await Promise.resolve(command.cleanup(context));
    }
  }

  return { result };
}
