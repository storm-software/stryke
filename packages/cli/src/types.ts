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

export interface BaseArgDef<
  T extends ArgType,
  VT extends boolean | number | string
> {
  displayName?: string;
  type?: T;
  description?: string;
  valueHint?: string;
  alias?: string | string[];
  default?: VT;
  required?: boolean;
  options?: (string | number)[];
}

export type BooleanArgDef = Omit<BaseArgDef<"boolean", boolean>, "options"> & {
  negativeDescription?: string;
};
export type StringArgDef = Omit<BaseArgDef<"string", string>, "options">;
export type NumberArgDef = Omit<BaseArgDef<"number", number>, "options">;
export type EnumArgDef = BaseArgDef<"enum", string>;
export type PositionalArgDef = Omit<
  BaseArgDef<"positional", string>,
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
  displayName?: string;
  description: string;
  version?: string;
  hidden?: boolean;
  author?: CommandMetaTitle;
  homepage?: string;
  license?: string;
  licensing?: string;
  docs?: string;
  repository?: string;
  contact?: string;
}

export type SubCommandsDef = Record<string, Resolvable<CommandDef<any>>>;

export interface CommandDef<TArgs extends ArgsDef = ArgsDef> {
  meta: Resolvable<CommandMeta>;
  args?: Resolvable<TArgs>;
  setup?: (context: CommandContext<TArgs>) => MaybePromise<any>;
  cleanup?: (context: CommandContext<TArgs>) => MaybePromise<any>;
  subCommands?: Resolvable<SubCommandsDef>;
  handle?: (context: CommandContext<TArgs>) => MaybePromise<any>;
}

export interface CommandContext<TArgs extends ArgsDef = ArgsDef> {
  rawArgs: string[];
  args: ParsedArgs<TArgs>;
  command: CommandDef<TArgs>;
  subCommand?: CommandDef<TArgs>;
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

/**
 * Defines the level of logs as specific numbers or special number types.
 *
 * LogLevel - Represents the log level.
 *
 * @defaultValue 0 - Represents the default log level.
 */
export type LogLevel = 0 | 1 | 2 | 3 | 4 | 5 | (number & {});

export interface InputLogObject {
  /**
   * The logging level of the message. See {@link LogLevel}.
   */
  level?: LogLevel;

  /**
   * A string tag to categorize or identify the log message.
   */
  tag?: string;

  /**
   * The type of log message, which affects how it's processed and displayed. See {@link LogType}.
   */
  type?: LogType;

  /**
   * The main log message text.
   */
  message?: string;

  /**
   * Additional text or texts to be logged with the message.
   */
  additional?: string | string[];

  /**
   * Additional arguments to be logged with the message.
   */
  args?: any[];

  /**
   * The date and time when the log message was created.
   */
  date?: Date;
}

export interface LogObject extends InputLogObject {
  /**
   * The logging level of the message, overridden if required. See {@link LogLevel}.
   */
  level?: LogLevel;

  /**
   * The type of log message, overridden if required. See {@link LogType}.
   */
  type?: LogType;

  /**
   * A string tag to categorize or identify the log message, overridden if necessary.
   */
  tag?: string;

  /**
   * Additional arguments to be logged with the message, overridden if necessary.
   */
  args?: any[];

  /**
   * Allows additional custom formatting options.
   */
  [key: string]: unknown;
}

/**
 * @see https://nodejs.org/api/util.html#util_util_inspect_object_showhidden_depth_colors
 */
export interface FormatOptions {
  /**
   * The maximum number of columns to output, affects formatting.
   */
  columns?: number;

  /**
   * Whether to include timestamp information in log messages.
   */
  date?: boolean;

  /**
   * Whether to use colors in the output.
   */
  colors?: boolean;

  /**
   * Specifies whether or not the output should be compact. Accepts a boolean or numeric level of compactness.
   */
  compact?: boolean | number;

  /**
   * Error cause level.
   */
  errorLevel?: number;

  /**
   * Allows additional custom formatting options.
   */
  [key: string]: unknown;
}

/**
 * Lists the types of log messages supported by the system.
 */
export type LogType =
  // 0
  | "silent"
  | "fatal"
  | "error"
  // 1
  | "warn"
  // 2
  | "log"
  // 3
  | "info"
  | "success"
  | "fail"
  | "ready"
  | "start"
  | "box"
  // Verbose
  | "debug"
  | "trace"
  | "verbose";
