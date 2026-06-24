/* -------------------------------------------------------------------

                       🗲 Storm Software - Stryke

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

import type { Options } from "human-id";
import { humanId as generateHumanId } from "human-id";

/**
 * Generates a human-readable unique identifier based on the provided options.
 *
 * @remarks
 * Human-ID generates readable strings by chaining common short words of the english language in a semi-meaningful way. The result is concatenated of adjective + noun + verb resulting in a minimum pool size of 15,000,000 possible combinations.
 *
 * @example
 * ```typescript
 * import { humanId } from "@stryke/unique-id";
 *
 * const id = humanId();
 * console.log(id); // Example output: "brave-lion-jumps"
 *
 * const customId = humanId({ separator: "_", capitalize: true, adjectiveCount: 2, addAdverb: true });
 * console.log(customId); // Example output: "Happy_Smart_Dog_Runs_Quickly"
 * ```
 *
 * @param options - An object containing configuration options for generating the human ID, such as separator, capitalization, adjective count, and whether to add an adverb.
 * @returns A string representing the generated human-readable unique identifier.
 */
export function humanId(options: Options): string {
  return generateHumanId({
    separator: "-",
    capitalize: false,
    ...options
  });
}
