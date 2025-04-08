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

import { ACRONYMS } from "./acronyms";
import { upperCaseFirst } from "./upper-case-first";

/**
 * Convert the input string to title case.
 *
 *  @remarks
 * "This Is An Example"
 *
 * @param input - The input string.
 * @returns The title cased string.
 */
export function titleCase<T extends string | undefined>(input?: T): T {
  if (!input) {
    return input as T;
  }

  return input
    .split(/(?=[A-Z])|[\s._-]/)
    .map(s => s.trim())
    .filter(Boolean)
    .map(s =>
      ACRONYMS.includes(s) ? s.toUpperCase() : upperCaseFirst(s.toLowerCase())
    )
    .join(" ") as T;
}
