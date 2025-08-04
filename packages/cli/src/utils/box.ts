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

import { getColor } from "./color";
import { stripAnsi } from "./strip-ansi";

export interface BoxBorderStyle {
  /**
   * Top left corner
   * @example `┌`
   * @example `╔`
   * @example `╓`
   */
  tl: string;
  /**
   * Top right corner
   * @example `┐`
   * @example `╗`
   * @example `╖`
   */
  tr: string;
  /**
   * Bottom left corner
   * @example `└`
   * @example `╚`
   * @example `╙`
   */
  bl: string;
  /**
   * Bottom right corner
   * @example `┘`
   * @example `╝`
   * @example `╜`
   */
  br: string;
  /**
   * Horizontal line
   * @example `─`
   * @example `═`
   * @example `─`
   */
  h: string;
  /**
   * Vertical line
   * @example `│`
   * @example `║`
   * @example `║`
   */
  v: string;
}

const boxStylePresets: Record<string, BoxBorderStyle> = {
  solid: {
    tl: "┌",
    tr: "┐",
    bl: "└",
    br: "┘",
    h: "─",
    v: "│"
  },
  double: {
    tl: "╔",
    tr: "╗",
    bl: "╚",
    br: "╝",
    h: "═",
    v: "║"
  },
  doubleSingle: {
    tl: "╓",
    tr: "╖",
    bl: "╙",
    br: "╜",
    h: "─",
    v: "║"
  },
  doubleSingleRounded: {
    tl: "╭",
    tr: "╮",
    bl: "╰",
    br: "╯",
    h: "─",
    v: "║"
  },
  singleThick: {
    tl: "┏",
    tr: "┓",
    bl: "┗",
    br: "┛",
    h: "━",
    v: "┃"
  },
  singleDouble: {
    tl: "╒",
    tr: "╕",
    bl: "╘",
    br: "╛",
    h: "═",
    v: "│"
  },
  singleDoubleRounded: {
    tl: "╭",
    tr: "╮",
    bl: "╰",
    br: "╯",
    h: "═",
    v: "│"
  },
  rounded: {
    tl: "╭",
    tr: "╮",
    bl: "╰",
    br: "╯",
    h: "─",
    v: "│"
  }
};

export interface BoxStyle {
  /**
   * The border color
   * @defaultValue 'white'
   */
  borderColor:
    | "black"
    | "red"
    | "green"
    | "yellow"
    | "blue"
    | "magenta"
    | "cyan"
    | "white"
    | "gray"
    | "blackBright"
    | "redBright"
    | "greenBright"
    | "yellowBright"
    | "blueBright"
    | "magentaBright"
    | "cyanBright"
    | "whiteBright";

  /**
   * The border style
   * @defaultValue 'solid'
   * @example 'single-double-rounded'
   * @example
   * ```ts
   * {
   *   tl: '┌',
   *   tr: '┐',
   *   bl: '└',
   *   br: '┘',
   *   h: '─',
   *   v: '│',
   * }
   * ```
   */
  borderStyle: BoxBorderStyle | keyof typeof boxStylePresets;

  /**
   * The vertical alignment of the text
   *
   * @defaultValue 'center'
   */
  valign: "top" | "center" | "bottom";

  /**
   * The padding of the box
   *
   * @defaultValue 2
   */
  padding: number;

  /**
   * The left margin of the box
   *
   * @defaultValue 1
   */
  marginLeft: number;

  /**
   * The top margin of the box
   *
   * @defaultValue 1
   */
  marginTop: number;

  /**
   * The bottom margin of the box
   *
   * @defaultValue 1
   */
  marginBottom: number;
}

/**
 * The border options of the box
 */
export interface BoxOpts {
  /**
   * Title that will be displayed on top of the box
   *
   * @example 'Hello World'
   * @example 'Hello \{name\}'
   */
  title?: string;

  style?: Partial<BoxStyle>;
}

/**
 * The default style applied to a box if no custom style is specified. See {@link BoxStyle}.
 */
const defaultStyle: BoxStyle = {
  borderColor: "white",
  borderStyle: "rounded",
  valign: "center",
  padding: 2,
  marginLeft: 1,
  marginTop: 1,
  marginBottom: 1
};

/**
 * Creates a styled box with text content, customizable via options.
 *
 * @param text - The text to display in the box.
 * @param _opts - Optional settings for the appearance and behavior of the box. See {@link BoxOpts}.
 * @returns The formatted box as a string, ready for printing or logging.
 */
export function box(text: string, _opts: BoxOpts = {}) {
  const opts = {
    ..._opts,
    style: {
      ...defaultStyle,
      ..._opts.style
    }
  };

  // Split the text into lines
  const textLines = text.split("\n");

  // Create the box
  const boxLines = [];

  // Get the characters for the box and colorize
  const _color = getColor(opts.style.borderColor);
  const borderStyle = {
    ...(typeof opts.style.borderStyle === "string"
      ? (boxStylePresets[opts.style.borderStyle] ?? boxStylePresets.solid)
      : opts.style.borderStyle)
  };
  if (_color) {
    for (const key in borderStyle) {
      borderStyle[key as keyof typeof borderStyle] = _color(
        borderStyle[key as keyof typeof borderStyle]!
      );
    }
  }

  // Calculate the width and height of the box
  const paddingOffset =
    opts.style.padding % 2 === 0 ? opts.style.padding : opts.style.padding + 1;
  const height = textLines.length + paddingOffset;
  const width =
    Math.max(
      ...textLines.map(line => stripAnsi(line).length),
      opts.title ? stripAnsi(opts.title).length : 0
    ) + paddingOffset;
  const widthOffset = width + paddingOffset;

  const leftSpace =
    opts.style.marginLeft > 0 ? " ".repeat(opts.style.marginLeft) : "";

  // Top line
  if (opts.style.marginTop > 0) {
    boxLines.push("".repeat(opts.style.marginTop));
  }
  // Include the title if it exists with borders
  if (opts.title) {
    const title = _color ? _color(opts.title) : opts.title;
    const left = borderStyle.h!.repeat(
      Math.floor((width - stripAnsi(opts.title).length) / 2)
    );
    const right = borderStyle.h!.repeat(
      width -
        stripAnsi(opts.title).length -
        stripAnsi(left).length +
        paddingOffset
    );
    boxLines.push(
      `${leftSpace}${borderStyle.tl}${left}${title}${right}${borderStyle.tr}`
    );
  } else {
    boxLines.push(
      `${leftSpace}${borderStyle.tl}${borderStyle.h!.repeat(widthOffset)}${
        borderStyle.tr
      }`
    );
  }

  // Middle lines
  const valignOffset =
    opts.style.valign === "center"
      ? Math.floor((height - textLines.length) / 2)
      : opts.style.valign === "top"
        ? height - textLines.length - paddingOffset
        : height - textLines.length;

  for (let i = 0; i < height; i++) {
    if (i < valignOffset || i >= valignOffset + textLines.length) {
      // Empty line
      boxLines.push(
        `${leftSpace}${borderStyle.v}${" ".repeat(widthOffset)}${borderStyle.v}`
      );
    } else {
      // Text line
      const line = textLines[i - valignOffset];
      const left = " ".repeat(paddingOffset);
      const right = " ".repeat(width - stripAnsi(line!).length);
      boxLines.push(
        `${leftSpace}${borderStyle.v}${left}${line}${right}${borderStyle.v}`
      );
    }
  }

  // Bottom line
  boxLines.push(
    `${leftSpace}${borderStyle.bl}${borderStyle.h!.repeat(widthOffset)}${
      borderStyle.br
    }`
  );
  if (opts.style.marginBottom > 0) {
    boxLines.push("".repeat(opts.style.marginBottom));
  }

  return boxLines.join("\n");
}
