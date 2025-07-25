/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/license.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://docs.stormsoftware.com/projects/stryke
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import { resolveArgs, resolveValue } from "./parse";
import type { ArgsDef, CommandDef, CommandMeta } from "./types";
import { colors } from "./utils/color";
import { formatColumns } from "./utils/format-columns";

export async function showUsage<T extends ArgsDef = ArgsDef>(
  cmd: CommandDef<T>,
  parent?: CommandDef<T>
) {
  try {
    console.log(`${await renderUsage(cmd, parent)}\n`);
  } catch (error) {
    console.error(error);
  }
}

// `no` prefix matcher (kebab-case or camelCase)
const negativePrefixRe = /^no[-A-Z]/;

export async function renderUsage<T extends ArgsDef = ArgsDef>(
  cmd: CommandDef<T>,
  parent?: CommandDef<T>
) {
  const cmdMeta = await resolveValue(cmd.meta ?? {});
  const cmdArgs = resolveArgs(await resolveValue(cmd.args ?? {}));
  const parentMeta = (await resolveValue(parent?.meta ?? {})) as CommandMeta;

  const commandName = `${parentMeta.name ? `${parentMeta.name} ` : ""}${
    cmdMeta.name || process.argv[1]
  }`;

  const argLines: string[][] = [];
  const posLines: string[][] = [];
  const commandsLines: string[][] = [];
  const usageLine = [];

  for (const arg of cmdArgs) {
    if (arg.type === "positional") {
      const name = arg.name.toUpperCase();
      const isRequired = arg.required !== false && arg.default === undefined;
      // (isRequired ? " (required)" : " (optional)"
      const defaultHint = arg.default ? `="${arg.default}"` : "";
      posLines.push([
        `\`${name}${defaultHint}\``,
        arg.description || "",
        arg.valueHint ? `<${arg.valueHint}>` : ""
      ]);
      usageLine.push(isRequired ? `<${name}>` : `[${name}]`);
    } else {
      const isRequired = arg.required === true && arg.default === undefined;
      const argStr =
        [...(arg.alias || []).map(a => `-${a}`), `--${arg.name}`].join(", ") +
        (arg.type === "string" && (arg.valueHint || arg.default)
          ? `=${
              arg.valueHint ? `<${arg.valueHint}>` : `"${arg.default || ""}"`
            }`
          : "") +
        (arg.type === "enum" && arg.options
          ? `=<${arg.options.join("|")}>`
          : "");
      argLines.push([
        `\`${argStr}${isRequired ? " (required)" : ""}\``,
        arg.description || ""
      ]);

      /**
       * print negative boolean arg variant usage when
       * - enabled by default or has `negativeDescription`
       * - not prefixed with `no-` or `no[A-Z]`
       */
      if (
        arg.type === "boolean" &&
        (arg.default === true || arg.negativeDescription) &&
        !negativePrefixRe.test(arg.name)
      ) {
        const negativeArgStr = [
          ...(arg.alias || []).map(a => `--no-${a}`),
          `--no-${arg.name}`
        ].join(", ");
        argLines.push([
          `\`${negativeArgStr}${isRequired ? " (required)" : ""}\``,
          arg.negativeDescription || ""
        ]);
      }

      if (isRequired) {
        usageLine.push(argStr);
      }
    }
  }

  if (cmd.subCommands) {
    const commandNames: string[] = [];
    const subCommands = await resolveValue(cmd.subCommands);
    for (const [name, sub] of Object.entries(subCommands)) {
      const subCmd = await resolveValue(sub);
      const meta = await resolveValue(subCmd?.meta);
      if (meta?.hidden) {
        continue;
      }
      commandsLines.push([`\`${name}\``, meta?.description || ""]);
      commandNames.push(name);
    }
    usageLine.push(commandNames.join("|"));
  }

  const usageLines: (string | undefined)[] = [];

  const version = cmdMeta.version || parentMeta.version;

  usageLines.push(
    colors.gray(
      `${cmdMeta.description} (${
        commandName + (version ? ` v${version}` : "")
      })`
    ),
    ""
  );

  const hasOptions = argLines.length > 0 || posLines.length > 0;
  usageLines.push(
    `${colors.underline(colors.bold("USAGE"))} \`${commandName}${
      hasOptions ? " [OPTIONS]" : ""
    } ${usageLine.join(" ")}\``,
    ""
  );

  if (posLines.length > 0) {
    usageLines.push(colors.underline(colors.bold("ARGUMENTS")), "");
    usageLines.push(formatColumns(posLines, "  "));
    usageLines.push("");
  }

  if (argLines.length > 0) {
    usageLines.push(colors.underline(colors.bold("OPTIONS")), "");
    usageLines.push(formatColumns(argLines, "  "));
    usageLines.push("");
  }

  if (commandsLines.length > 0) {
    usageLines.push(colors.underline(colors.bold("COMMANDS")), "");
    usageLines.push(formatColumns(commandsLines, "  "));
    usageLines.push(
      "",
      `Use \`${commandName} <command> --help\` for more information about a command.`
    );
  }

  return usageLines.filter(l => typeof l === "string").join("\n");
}
