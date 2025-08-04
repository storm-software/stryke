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

import { EMPTY_STRING } from "@stryke/types/base";

const singleComment = Symbol("singleComment");
const multiComment = Symbol("multiComment");

function stripWithoutWhitespace() {
  return "";
}
function stripWithWhitespace(value: string, start?: number, end?: number) {
  return value.slice(start, end).replace(/\S/g, " ");
}

function isEscaped(value: string, quotePosition: number) {
  let index = quotePosition - 1;
  let backslashCount = 0;
  while (value[index] === "\\") {
    index -= 1;
    backslashCount += 1;
  }

  return Boolean(backslashCount % 2);
}

export function stripComments(
  value: string,
  { whitespace = true, trailingCommas = false } = {}
) {
  if (typeof value !== "string") {
    throw new TypeError(
      `Expected argument \`jsonString\` to be a \`string\`, got \`${typeof value}\``
    );
  }

  const strip = whitespace ? stripWithWhitespace : stripWithoutWhitespace;
  let isInsideString: boolean | symbol = false;
  let isInsideComment: boolean | symbol = false;
  let offset = 0;
  let buffer = "";
  let result = "";
  let commaIndex = -1;
  for (let index = 0; index < value.length; index++) {
    const currentCharacter = value[index];
    const nextCharacter = value[index + 1];
    if (!isInsideComment && currentCharacter === '"') {
      const escaped = isEscaped(value, index);
      if (!escaped) {
        isInsideString = !isInsideString;
      }
    }
    if (isInsideString) {
      continue;
    }
    if (
      !isInsideComment &&
      currentCharacter + (nextCharacter ?? EMPTY_STRING) === "//"
    ) {
      buffer += value.slice(offset, index);
      offset = index;
      isInsideComment = singleComment;
      index++;
    } else if (
      isInsideComment === singleComment &&
      currentCharacter + (nextCharacter ?? EMPTY_STRING) === "\r\n"
    ) {
      index++;
      isInsideComment = false;
      buffer += strip(value, offset, index);
      offset = index;
    } else if (isInsideComment === singleComment && currentCharacter === "\n") {
      isInsideComment = false;
      buffer += strip(value, offset, index);
      offset = index;
    } else if (
      !isInsideComment &&
      currentCharacter + (nextCharacter ?? EMPTY_STRING) === "/*"
    ) {
      buffer += value.slice(offset, index);
      offset = index;
      isInsideComment = multiComment;
      index++;
    } else if (
      isInsideComment === multiComment &&
      currentCharacter + (nextCharacter ?? EMPTY_STRING) === "*/"
    ) {
      index++;
      isInsideComment = false;
      buffer += strip(value, offset, index + 1);
      offset = index + 1;
    } else if (trailingCommas && !isInsideComment) {
      if (commaIndex !== -1) {
        if (currentCharacter === "}" || currentCharacter === "]") {
          buffer += value.slice(offset, index);
          result += strip(buffer, 0, 1) + buffer.slice(1);
          buffer = "";
          offset = index;
          commaIndex = -1;
        } else if (
          currentCharacter !== " " &&
          currentCharacter !== "	" &&
          currentCharacter !== "\r" &&
          currentCharacter !== "\n"
        ) {
          buffer += value.slice(offset, index);
          offset = index;
          commaIndex = -1;
        }
      } else if (currentCharacter === ",") {
        result += buffer + value.slice(offset, index);
        buffer = "";
        offset = index;
        commaIndex = index;
      }
    }
  }

  return (
    result +
    buffer +
    (isInsideComment ? strip(value.slice(offset)) : value.slice(offset))
  );
}
