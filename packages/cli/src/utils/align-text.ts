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

export type AlignTextFn = (
  lineLength: number,
  maxLength: number,
  line: string,
  lines: string[],
  index: number
) => { indent?: number; character?: string; prefix?: string };

export function alignText(val: string, align: AlignTextFn) {
  const lines = val.split("\n");
  const maxLength = Math.max(...lines.map(l => l.length));

  return lines
    .map((line, index) => {
      const lineLength = line.length;
      const {
        indent = 0,
        character = " ",
        prefix = ""
      } = align(lineLength, maxLength, line, lines, index) ?? {};

      return `${prefix}${character.repeat(indent)}${line}`;
    })
    .join("\n");
}

export function alignTextLeft(lineLength: number, maxLength: number) {
  return { indent: maxLength - lineLength };
}

export function alignTextRight(lineLength: number, maxLength: number) {
  return { indent: maxLength - lineLength, character: " ", prefix: "" };
}

export function alignTextCenter(lineLength: number, maxLength: number) {
  const diff = maxLength - lineLength;
  const indent = Math.floor(diff / 2);
  const character = " ";

  return { indent, character, prefix: "" };
}

export function alignTextJustify(
  lineLength: number,
  maxLength: number,
  line: string,
  lines: string[]
) {
  const diff = maxLength - lineLength;
  const indent = Math.floor(diff / (lines.length - 1));
  const character = " ";

  return { indent, character, prefix: "" };
}

/**
 * Aligns the text to the specified direction.
 *
 * @param val - The text to align.
 * @param direction - The direction to align the text.
 * @returns The aligned text.
 */
export function align(
  val: string,
  direction: "left" | "right" | "center" | "justify"
) {
  let alignFn: AlignTextFn;
  switch (direction) {
    case "left":
      alignFn = alignTextLeft;
      break;
    case "right":
      alignFn = alignTextRight;
      break;
    case "center":
      alignFn = alignTextCenter;
      break;
    case "justify":
      alignFn = alignTextJustify;
      break;
    default:
      throw new Error(`Invalid alignment direction: ${direction as string}`);
  }

  return alignText(val, alignFn);
}
