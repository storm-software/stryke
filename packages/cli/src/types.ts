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

import type { MaybePromise } from "@stryke/types/base";
import type { Command } from "commander";
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

export interface CLIConfig {
  name: string;
  banner?: CLITitle;
  by?: CLITitle;
  description: string;
  homepageUrl?: string;
  documentationUrl?: string;
  repositoryUrl?: string;
  license?: string;
  licenseUrl?: string;
  commands: CLICommand[];
  preAction: (command: Command) => MaybePromise<void>;
  postAction: (command: Command) => MaybePromise<void>;
}

export interface CLITitle {
  name?: string;
  font?: Fonts;
  options?: Options;
  hide?: boolean;
}

export interface CLICommand {
  name: string;
  description: string;
  commands?: CLICommand[];
  options?: CLIOption[];
  argument?: CLIArgument[];
  action: (...args: any[]) => MaybePromise<void>;
}

export interface CLIArgument {
  flags: string;
  description?: string;
  default?: unknown | undefined;
}

export interface CLIOption {
  flags: string;
  description: string | undefined;
  choices?: string[];
  default?: CLIOptionDefault;
}

export interface CLIOptionDefault {
  value: unknown;
  description?: string | undefined;
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

export const CLICommandType = {
  AGENT: "agent" as CLICommandType,
  RUN: "run" as CLICommandType,
  INSTALL: "install" as CLICommandType,
  FROZEN: "frozen" as CLICommandType,
  GLOBAL: "global" as CLICommandType,
  ADD: "add" as CLICommandType,
  UPGRADE: "upgrade" as CLICommandType,
  UPGRADE_INTERACTIVE: "upgrade-interactive" as CLICommandType,
  EXECUTE: "execute" as CLICommandType,
  UNINSTALL: "uninstall" as CLICommandType,
  GLOBAL_UNINSTALL: "global_uninstall" as CLICommandType
};
