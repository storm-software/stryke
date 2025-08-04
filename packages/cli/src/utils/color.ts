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

import { isColorSupported } from "@stryke/env/environment-checks";

function replaceClose(
  index: number,
  string: string,
  close: string,
  replace: string,
  head = string.slice(0, Math.max(0, index)) + replace,
  tail = string.slice(Math.max(0, index + close.length)),
  next = tail.indexOf(close)
): string {
  return head + (next < 0 ? tail : replaceClose(next, tail, close, replace));
}

function clearBleed(
  index: number,
  string: string,
  open: string,
  close: string,
  replace: string
) {
  return index < 0
    ? open + string + close
    : open + replaceClose(index, string, close, replace) + close;
}

function filterEmpty(
  open: string,
  close: string,
  replace = open,
  at = open.length + 1
) {
  return (string: string) =>
    string || !(string === "" || string === undefined)
      ? clearBleed(`${string}`.indexOf(close, at), string, open, close, replace)
      : "";
}

function init(open: number, close: number, replace?: string) {
  return filterEmpty(`\u001B[${open}m`, `\u001B[${close}m`, replace);
}

const colorDefs = {
  reset: init(0, 0),
  bold: init(1, 22, "\u001B[22m\u001B[1m"),
  dim: init(2, 22, "\u001B[22m\u001B[2m"),
  italic: init(3, 23),
  underline: init(4, 24),
  inverse: init(7, 27),
  hidden: init(8, 28),
  strikethrough: init(9, 29),
  black: init(30, 39),
  red: init(31, 39),
  green: init(32, 39),
  yellow: init(33, 39),
  blue: init(34, 39),
  magenta: init(35, 39),
  cyan: init(36, 39),
  white: init(37, 39),
  gray: init(90, 39),
  bgBlack: init(40, 49),
  bgRed: init(41, 49),
  bgGreen: init(42, 49),
  bgYellow: init(43, 49),
  bgBlue: init(44, 49),
  bgMagenta: init(45, 49),
  bgCyan: init(46, 49),
  bgWhite: init(47, 49),
  blackBright: init(90, 39),
  redBright: init(91, 39),
  greenBright: init(92, 39),
  yellowBright: init(93, 39),
  blueBright: init(94, 39),
  magentaBright: init(95, 39),
  cyanBright: init(96, 39),
  whiteBright: init(97, 39),
  bgBlackBright: init(100, 49),
  bgRedBright: init(101, 49),
  bgGreenBright: init(102, 49),
  bgYellowBright: init(103, 49),
  bgBlueBright: init(104, 49),
  bgMagentaBright: init(105, 49),
  bgCyanBright: init(106, 49),
  bgWhiteBright: init(107, 49)
};

export type ColorName = keyof typeof colorDefs;
export type ColorFunction = (text: string | number) => string;

/**
 * Creates an object that maps color names to their respective color functions,
 * based on whether or not color support is enabled.
 *
 * @param useColor - Specifies whether to use color functions or fallback to plain strings.
 * @returns An object where keys are color names and values are functions to apply those colors. See {@link ColorFunction}.
 */
function createColors(useColor = isColorSupported) {
  return useColor
    ? colorDefs
    : Object.fromEntries(Object.keys(colorDefs).map(key => [key, String]));
}

/**
 * An object containing functions for coloring text. Each function corresponds to a terminal color. See {@link ColorName} for available colors.
 */
export const colors = createColors() as Record<ColorName, ColorFunction>;

/**
 * Gets a color function by name, with an option for a fallback color if the requested color is not found.
 *
 * @param color - The name of the color function to get. See {@link ColorName}.
 * @param fallback - The name of the fallback color function if the requested color is not found. See {@link ColorName}.
 * @returns The color function that corresponds to the requested color, or the fallback color function. See {@link ColorFunction}.
 */
export function getColor(
  color: ColorName,
  fallback: ColorName = "reset"
): ColorFunction {
  return colors[color] || colors[fallback];
}

/**
 * Applies a specified color to a given text string or number.
 *
 * @param color - The color to apply. See {@link ColorName}.
 * @param text - The text to color.
 * @returns The colored text.
 */
export function colorize(color: ColorName, text: string | number): string {
  return getColor(color)(text);
}
