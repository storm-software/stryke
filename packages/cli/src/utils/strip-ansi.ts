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

// eslint-disable-next-line regexp/no-useless-non-capturing-group, regexp/no-trivially-nested-quantifier, regexp/no-useless-quantifier, regexp/prefer-w, regexp/no-useless-escape
const ansiRegex = [
  String.raw`[\u001B\u009B][[\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\d\/#&.:=?%@~_]+)*|[a-zA-Z\d]+(?:;[-a-zA-Z\d\/#&.:=?%@~_]*)*)?\u0007)`,
  String.raw`(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-nq-uy=><~]))`
].join("|");

/**
 * Removes ANSI escape codes from a given string. This is particularly useful for
 * processing text that contains formatting codes, such as colors or styles, so that the
 * the raw text without any visual formatting.
 *
 * @param text - The text string from which to strip the ANSI escape codes.
 * @returns The text without ANSI escape codes.
 */
export function stripAnsi(text: string) {
  return text.replace(new RegExp(ansiRegex, "g"), "");
}
