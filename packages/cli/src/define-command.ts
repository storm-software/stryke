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

import type { ArgsDef, CommandDef } from "./types";

/**
 * Define a command with the given definition.
 *
 * @param def - The command definition to use.
 * @returns The command definition.
 */
export function defineCommand<const T extends ArgsDef = ArgsDef>(
  def: CommandDef<T>
): CommandDef<T> {
  return def;
}
