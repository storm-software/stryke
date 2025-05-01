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

// Parser is based on https://github.com/lukeed/mri 1.2.0 (MIT)
// Check the main LICENSE file for more info.

import { toArray } from "@stryke/convert/to-array";
import { camelCase } from "@stryke/string-format/camel-case";
import { constantCase } from "@stryke/string-format/constant-case";
import { kebabCase } from "@stryke/string-format/kebab-case";
import { isBoolean } from "@stryke/type-checks/is-boolean";
import { isFunction } from "@stryke/type-checks/is-function";
import type { Arrayable } from "@stryke/types/array";
import type { Resolvable } from "@stryke/types/async";
import type { Dictionary, MaybePromise } from "@stryke/types/base";
import defu from "defu";
import type {
  Arg,
  ArgsDef,
  CommandDef,
  CommandMeta,
  ParsedArgs
} from "./types";

export interface Options {
  boolean?: Arrayable<string>;
  string?: Arrayable<string>;
  alias?: Dictionary<Arrayable<string>>;
  default?: Dictionary<any>;
  unknown?: (flag: string) => void;
}

export type Argv<T = Dictionary<any>> = T & {
  _: string[];
  [key: string]: any;
};

function toVal(
  out: { [x: string]: any; _: any[] },
  key: string | number,
  val: string | boolean | undefined,
  opts: Options
) {
  let x;
  const old = out[key];

  const nxt =
    opts.string && ~opts.string.indexOf(String(key))
      ? val == undefined || val === true
        ? ""
        : String(val)
      : isBoolean(val)
        ? val
        : opts.boolean && ~opts.boolean.indexOf(String(key))
          ? val === "false"
            ? false
            : val === "true" ||
              (out._.push(((x = +val!), x * 0 === 0) ? x : val), !!val)
          : ((x = +val!), x * 0 === 0)
            ? x
            : val;
  out[key] =
    old == undefined ? nxt : Array.isArray(old) ? old.concat(nxt) : [old, nxt];
}

/**
 * Parses the given raw arguments and returns an object containing the parsed arguments. This function will also resolve any aliases and defaults defined in the argument definition object.
 *
 * @param args - The raw arguments passed to the command
 * @param opts - The options object containing the argument definitions
 * @returns An object containing the parsed arguments
 */
export function parseRawArgs<T = Dictionary<any>>(
  args: string[] = [],
  opts: Options = {}
): Argv<T> {
  let k;
  let arr = [] as string[];
  let arg!: string;
  let name;
  let val;
  const out = { _: [] as string[] } as Argv<T>;
  let i = 0;
  let j = 0;
  let idx = 0;
  const len = args.length;

  const alibi = opts.alias !== void 0;
  const strict = opts.unknown !== void 0;
  const defaults = opts.default !== void 0;

  opts.alias = opts.alias ?? {};
  opts.string = toArray(opts.string);
  opts.boolean = toArray(opts.boolean);

  if (alibi) {
    for (k in opts.alias) {
      opts.alias[k] = toArray(opts.alias[k]);
      if (opts.alias[k] && opts.alias[k]!.length === 0) {
        arr = toArray(opts.alias[k]);
        for (i = 0; i < arr.length; i++) {
          (opts.alias[arr[i]!] = arr.concat(k)).splice(i, 1);
        }
      }
    }
  }

  for (i = opts.boolean.length; i-- > 0; ) {
    arr = toArray(opts.alias[opts.boolean[i]!]);
    for (j = arr.length; j-- > 0; ) {
      opts.boolean.push(arr[j]!);
    }
  }

  for (i = opts.string.length; i-- > 0; ) {
    arr = toArray(opts.alias[opts.string[i]!]);
    for (j = arr.length; j-- > 0; ) {
      opts.string.push(arr[j]!);
    }
  }

  if (defaults) {
    for (k in opts.default) {
      if (opts.default) {
        name = typeof opts.default[k];
        arr = toArray(opts.alias[k]);
        if (opts[name as keyof Options] !== void 0) {
          (opts[name as keyof Options] as string[]).push(k);
          for (i = 0; i < arr.length; i++) {
            (opts[name as keyof Options] as string[]).push(arr[i]!);
          }
        }
      }
    }
  }

  const keys = strict ? Object.keys(opts.alias) : [];

  for (i = 0; i < len; i++) {
    if (args[i]) {
      arg = args[i]!;

      if (arg === "--") {
        out._ = out._.concat(args.slice(++i));
        break;
      }

      for (j = 0; j < arg.length; j++) {
        if (arg.charCodeAt(j) !== 45) {
          break;
        } // "-"
      }

      if (j === 0) {
        out._.push(arg);
      } else if (arg.substring(j, j + 3) === "no-") {
        name = arg.slice(Math.max(0, j + 3));
        if (strict && !~keys.indexOf(name)) {
          return opts.unknown!(arg) as any;
        }
        out[name as keyof Argv<T>] = false;
      } else {
        for (idx = j + 1; idx < arg.length; idx++) {
          if (arg.charCodeAt(idx) === 61) {
            break;
          } // "="
        }

        name = arg.substring(j, idx);
        val =
          arg.slice(Math.max(0, ++idx)) ||
          i + 1 === len ||
          `${args[i + 1]}`.charCodeAt(0) === 45 ||
          args[++i];
        arr = toArray(j === 2 ? [name] : name);

        for (idx = 0; idx < arr.length; idx++) {
          name = arr[idx];
          if (strict && (!name || !~keys.indexOf(name))) {
            return opts.unknown!("-".repeat(j) + name) as any;
          }
          toVal(out, name as string, idx + 1 < arr.length || val, opts);
        }
      }
    }
  }

  if (defaults && opts.default) {
    for (k in opts.default) {
      if (out[k] === void 0) {
        out[k as keyof Argv<T>] = opts.default[k];
      }
    }
  }

  if (alibi) {
    for (k in out) {
      arr = toArray(opts.alias[k]);
      while (arr.length > 0) {
        out[arr.shift() as keyof Argv<T>] = out[k];
      }
    }
  }

  return out;
}

/**
 * Parses the given raw arguments and returns an object containing the parsed arguments. This function will also resolve any aliases and defaults defined in the argument definition object.
 *
 * @param rawArgs - The raw arguments passed to the command
 * @param argsDef - The argument definition object
 * @returns An object containing the parsed arguments
 */
export function parseArgs<T extends ArgsDef = ArgsDef>(
  rawArgs: string[],
  argsDef: ArgsDef
): ParsedArgs<T> {
  const parseOptions = {
    boolean: [] as string[],
    string: [] as string[],
    number: [] as string[],
    enum: [] as (number | string)[],
    mixed: [] as string[],
    alias: {} as Record<string, string | string[]>,
    default: {} as Record<string, boolean | number | string>
  };

  const args = resolveArgs(argsDef);

  for (const arg of args) {
    if (arg.type === "positional") {
      continue;
    }

    if (arg.type === "string" || arg.type === "number") {
      parseOptions.string.push(arg.name);
    } else if (arg.type === "boolean") {
      parseOptions.boolean.push(arg.name);
    } else if (arg.type === "enum") {
      parseOptions.enum.push(...(arg.options ?? []));
    }

    if (arg.default !== undefined) {
      parseOptions.default[arg.name] = arg.default;
    }
    if (arg.alias) {
      parseOptions.alias[arg.name] = arg.alias;
    }
  }

  const parsed = parseRawArgs(rawArgs, parseOptions);
  const [...positionalArguments] = parsed._;

  const parsedArgsProxy = new Proxy(parsed, {
    get(target: ParsedArgs<any>, prop: string) {
      return (
        target[prop] ??
        target[camelCase(prop)] ??
        target[kebabCase(prop)] ??
        process.env[constantCase(prop)]
      );
    }
  });

  for (const [, arg] of args.entries()) {
    if (arg.type === "positional") {
      const nextPositionalArgument = positionalArguments.shift();
      if (nextPositionalArgument !== undefined) {
        parsedArgsProxy[arg.name] = nextPositionalArgument;
      } else if (arg.default === undefined && arg.required !== false) {
        throw new Error(
          `Missing required positional argument: ${arg.name.toUpperCase()}`
        );
      } else {
        parsedArgsProxy[arg.name] = arg.default;
      }
    } else if (arg.type === "enum") {
      const argument = parsedArgsProxy[arg.name];
      const options = arg.options ?? [];
      if (
        argument !== undefined &&
        options.length > 0 &&
        !options.includes(argument)
      ) {
        throw new Error(
          `Invalid value for argument: \`--${arg.name}\` (\`${argument}\`). Expected one of: ${options.map(o => `\`${o}\``).join(", ")}.`
        );
      }
    } else if (arg.type === "number") {
      const _originalValue = parsedArgsProxy[arg.name];
      parsedArgsProxy[arg.name] = Number.parseFloat(
        parsedArgsProxy[arg.name] as string
      );
      if (Number.isNaN(parsedArgsProxy[arg.name])) {
        throw new TypeError(
          `Invalid value for argument: \`--${arg.name}\` (\`${_originalValue}\`). Expected a number.`
        );
      }
    } else if (arg.required && parsedArgsProxy[arg.name] === undefined) {
      throw new Error(`Missing required argument: --${arg.name}`);
    }
  }

  return parsedArgsProxy as ParsedArgs<T>;
}

/**
 * Resolves the given value. If the value is a function, it will call the function and return the result. If the value is not a function, it will return the value as is. This function is useful for resolving values that may be functions or static values.
 *
 * @param input - The value to resolve
 * @returns The resolved value
 */
export function resolveValue<T>(input: Resolvable<T>): MaybePromise<T> {
  // eslint-disable-next-line ts/no-unsafe-call
  return isFunction(input) ? (input as any)() : input;
}

/**
 * Converts the given argument definition to an array of arguments. This function will iterate over the argument definition object and convert each argument definition to an array of arguments. It will also convert the alias property to an array of strings.
 *
 * @param argsDef - The argument definition object
 * @returns An array of arguments
 */
export function resolveArgs(argsDef: ArgsDef): Arg[] {
  const args: Arg[] = [];
  for (const [name, argDef] of Object.entries(argsDef || {})) {
    args.push({
      ...argDef,
      name,
      alias: toArray((argDef as any).alias)
    });
  }
  return args;
}

/**
 * Resolves the subcommand from the command definition and the raw arguments. It will recursively resolve the subcommands until it finds the final command.
 *
 * @param command - The command definition
 * @param rawArgs - The raw arguments passed to the command
 * @param parent - The parent command definition (if any)
 * @returns The resolved command definition
 */
export async function resolveCommand<T extends ArgsDef = ArgsDef>(
  command: CommandDef<T>,
  rawArgs: string[],
  parent?: CommandDef<T>
): Promise<CommandDef<T>> {
  let meta = {} as Partial<CommandMeta>;
  if (parent?.meta) {
    meta = isFunction(parent?.meta) ? await parent.meta() : await parent.meta;
  }

  command.meta = defu(
    isFunction(command?.meta) ? await command.meta() : await command.meta,
    meta
  );

  const subCommands = await resolveValue(command.subCommands);
  if (subCommands && Object.keys(subCommands).length > 0) {
    const subCommandArgIndex = rawArgs.findIndex(arg => !arg.startsWith("-"));
    const subCommandName = rawArgs[subCommandArgIndex];
    const subCommand = await resolveValue(subCommands[subCommandName!]);
    if (
      !subCommand?.handle &&
      (!subCommand?.subCommands ||
        Object.keys(subCommand.subCommands).length === 0)
    ) {
      throw new Error(
        `Invalid subcommand ${subCommandName}: Must have a handle or subcommands`
      );
    }

    if (subCommand) {
      return resolveCommand(
        subCommand,
        rawArgs.slice(subCommandArgIndex + 1),
        command
      );
    }
  }

  return command;
}
