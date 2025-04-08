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
