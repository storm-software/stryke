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

import type { Resolvable } from "@stryke/types/async";
import type { MaybePromise } from "@stryke/types/base";
import type { Fonts, Options } from "figlet";

/**
 * A resolved command with arguments using the current directories package manager
 */
export interface ResolvedCommand {
  /**
   * CLI command.
   */
  command: string;
  /**
   * Arguments for the CLI command, merged with user arguments.
   */
  args: string[];
}

export type ArgType =
  | "boolean"
  | "string"
  | "number"
  | "enum"
  | "positional"
  | undefined;

export interface _ArgDef<
  T extends ArgType,
  VT extends boolean | number | string
> {
  type?: T;
  description?: string;
  valueHint?: string;
  alias?: string | string[];
  default?: VT;
  required?: boolean;
  options?: (string | number)[];
}

export type BooleanArgDef = Omit<_ArgDef<"boolean", boolean>, "options"> & {
  negativeDescription?: string;
};
export type StringArgDef = Omit<_ArgDef<"string", string>, "options">;
export type NumberArgDef = Omit<_ArgDef<"number", number>, "options">;
export type EnumArgDef = _ArgDef<"enum", string>;
export type PositionalArgDef = Omit<
  _ArgDef<"positional", string>,
  "alias" | "options"
>;

export type ArgDef =
  | BooleanArgDef
  | StringArgDef
  | NumberArgDef
  | PositionalArgDef
  | EnumArgDef;

export type ArgsDef = Record<string, ArgDef>;

export type Arg = ArgDef & { name: string; alias: string[] };

type ResolveParsedArgType<T extends ArgDef, VT> = T extends {
  default?: any;
  required?: boolean;
}
  ? T["default"] extends NonNullable<VT>
    ? VT
    : T["required"] extends true
      ? VT
      : VT | undefined
  : VT | undefined;

type ParsedPositionalArg<T extends ArgDef> = T extends { type: "positional" }
  ? ResolveParsedArgType<T, string>
  : never;

type ParsedStringArg<T extends ArgDef> = T extends { type: "string" }
  ? ResolveParsedArgType<T, string>
  : never;

type ParsedNumberArg<T extends ArgDef> = T extends { type: "number" }
  ? ResolveParsedArgType<T, number>
  : never;

type ParsedBooleanArg<T extends ArgDef> = T extends { type: "boolean" }
  ? ResolveParsedArgType<T, boolean>
  : never;

type ParsedEnumArg<T extends ArgDef> = T extends {
  type: "enum";
  options: infer U;
}
  ? U extends Array<any>
    ? ResolveParsedArgType<T, U[number]>
    : never
  : never;

interface RawArgs {
  _: string[];
}

// prettier-ignore
type ParsedArg<T extends ArgDef> =
  T["type"] extends "positional" ? ParsedPositionalArg<T> :
  T["type"] extends "boolean" ? ParsedBooleanArg<T> :
  T["type"] extends "string" ? ParsedStringArg<T> :
  T["type"] extends "number" ? ParsedNumberArg<T> :
  T["type"] extends "enum" ? ParsedEnumArg<T> :
  never;

// prettier-ignore
export type ParsedArgs<T extends ArgsDef = ArgsDef> = RawArgs &
  { [K in keyof T]: ParsedArg<T[K]>; } &
  { [K in keyof T as T[K] extends { alias: string } ? T[K]["alias"] : never]: ParsedArg<T[K]> } &
  { [K in keyof T as T[K] extends { alias: string[] } ? T[K]["alias"][number] : never]: ParsedArg<T[K]> } &
  Record<string, string | number | boolean | string[]>;

export interface CommandMetaTitle {
  name?: string;
  font?: Fonts;
  options?: Options;
  hidden?: boolean;
}

export interface CommandMeta {
  name: string;
  description: string;
  version?: string;
  hidden?: boolean;
  banner?: CommandMetaTitle;
  by?: CommandMetaTitle;
}

export type SubCommandsDef = Record<string, Resolvable<CommandDef<any>>>;

export interface CommandDef<T extends ArgsDef = ArgsDef> {
  meta?: Resolvable<CommandMeta>;
  args?: Resolvable<T>;
  subCommands?: Resolvable<SubCommandsDef>;
  setup?: (context: CommandContext<T>) => MaybePromise<any>;
  cleanup?: (context: CommandContext<T>) => MaybePromise<any>;
  run?: (context: CommandContext<T>) => MaybePromise<any>;
}

export interface CommandContext<T extends ArgsDef = ArgsDef> {
  rawArgs: string[];
  args: ParsedArgs<T>;
  cmd: CommandDef<T>;
  subCommand?: CommandDef<T>;
  data?: any;
}

export type CLICommandType =
  | "agent"
  | "run"
  | "install"
  | "frozen"
  | "global"
  | "add"
  | "upgrade"
  | "upgrade-interactive"
  | "execute"
  | "uninstall"
  | "global_uninstall";
