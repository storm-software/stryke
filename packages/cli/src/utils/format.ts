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

import isUnicodeSupported from "is-unicode-supported";
import { formatWithOptions } from "node:util";
import _stringWidth from "string-width";
import type { FormatOptions, LogLevel, LogObject, LogType } from "../types";
import type { BoxOpts } from "./box";
import { box } from "./box";
import { colors } from "./color";
import { stripAnsi } from "./strip-ansi";

export const TYPE_COLOR_MAP: { [k in LogType]?: string } = {
  info: "cyan",
  fail: "red",
  success: "green",
  ready: "green",
  start: "magenta"
};

export const LEVEL_COLOR_MAP: { [k in LogLevel]?: string } = {
  0: "red",
  1: "yellow"
};

const unicode = isUnicodeSupported();
const s = (c: string, fallback: string) => (unicode ? c : fallback);
const TYPE_ICONS: { [k in LogType]?: string } = {
  error: s("✖", "×"),
  fatal: s("✖", "×"),
  ready: s("✔", "√"),
  warn: s("⚠", "‼"),
  info: s("ℹ", "i"),
  success: s("✔", "√"),
  debug: s("⚙", "D"),
  trace: s("→", "→"),
  fail: s("✖", "×"),
  start: s("◐", "o"),
  log: ""
};

function getColor(color = "white") {
  return (colors as any)[color] || colors.white;
}

function getBgColor(color = "bgWhite") {
  return (
    (colors as any)[`bg${color[0]?.toUpperCase()}${color.slice(1)}`] ||
    colors.bgWhite
  );
}

function characterFormat(str: string) {
  return (
    str
      // highlight backticks
      .replace(/`([^`]+)`/g, (_, m) => colors.cyan(m))
      // underline underscores
      .replace(/\s+_([^_]+)_\s+/g, (_, m) => ` ${colors.underline(m)} `)
  );
}

function stringWidth(str: string) {
  // https://github.com/unjs/consola/issues/204
  const hasICU = typeof Intl === "object";
  if (!hasICU || !Intl.Segmenter) {
    return stripAnsi(str).length;
  }
  return _stringWidth(str);
}

function getLevelFromType(type: LogType = "log") {
  if (type === "fatal" || type === "error" || type === "fail") {
    return 0;
  }
  if (type === "warn") {
    return 1;
  }

  if (type === "log") {
    return 2;
  }

  return 3;
}

export function formatType(logObj: LogObject, isBadge: boolean) {
  const type = logObj.type || "log";
  const level = logObj.level ?? getLevelFromType(type);

  const typeColor =
    (TYPE_COLOR_MAP as any)[type] || (LEVEL_COLOR_MAP as any)[level] || "gray";

  if (isBadge) {
    // eslint-disable-next-line ts/no-unsafe-call
    return getBgColor(typeColor)(colors.black(` ${type.toUpperCase()} `));
  }

  const _type =
    typeof (TYPE_ICONS as any)[type] === "string"
      ? (TYPE_ICONS as any)[type]
      : (logObj as any).icon || type;

  // eslint-disable-next-line ts/no-unsafe-call
  return _type ? getColor(typeColor)(_type) : "";
}

export function format(logObj: LogObject, opts: FormatOptions = {}) {
  const level = logObj.level ?? getLevelFromType(logObj.type);

  const [message, ...additional] = formatWithOptions(
    opts,
    ...(logObj.args ?? [])
  ).split("\n");

  if (logObj.type === "box") {
    return box(
      characterFormat(
        message + (additional.length > 0 ? `\n${additional.join("\n")}` : "")
      ),
      {
        title: logObj.title
          ? characterFormat(logObj.title as string)
          : undefined,
        style: logObj.style as BoxOpts["style"]
      }
    );
  }

  const date = opts.date ? new Date().toLocaleTimeString() : "";
  const coloredDate = date && colors.gray(date);

  const isBadge = (logObj.badge as boolean) ?? level < 2;
  const type = formatType(logObj, isBadge);

  const tag = logObj.tag ? colors.gray(logObj.tag) : "";

  let line;
  const left = [type, characterFormat(message ?? "")].filter(Boolean).join(" ");
  const right = [tag, coloredDate].filter(Boolean).join(" ");
  const space =
    (opts.columns ?? 0) - stringWidth(left) - stringWidth(right) - 2;

  line =
    space > 0 && (opts.columns ?? 0) >= 80
      ? left + " ".repeat(space) + right
      : (right ? `${colors.gray(`[${right}]`)} ` : "") + left;

  line += characterFormat(
    additional.length > 0 ? `\n${additional.join("\n")}` : ""
  );

  return isBadge ? `\n${line}\n` : line;
}
