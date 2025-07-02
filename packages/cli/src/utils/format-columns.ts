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

/**
 * Formats a 2D array of strings into a columnar format.
 *
 * @param lines - The 2D array of strings to format.
 * @param linePrefix - The prefix to add to each line.
 * @returns A string representing the formatted columns.
 */
export function formatColumns(lines: string[][], linePrefix = "") {
  const maxLength: number[] = [];
  for (const line of lines) {
    for (const [i, element] of line.entries()) {
      maxLength[i] = Math.max(maxLength[i] ?? 0, element.length);
    }
  }
  return lines
    .map(l =>
      l
        .map(
          (c, i) =>
            linePrefix + c[i === 0 ? "padStart" : "padEnd"](maxLength[i]!)
        )
        .join("  ")
    )
    .join("\n");
}
