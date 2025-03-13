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

import { existsSync } from "@stryke/path/exists";
import { findFileName, findFilePath } from "@stryke/path/file-path-fns";
import { joinPaths } from "@stryke/path/join-paths";
import { EMPTY_STRING } from "@stryke/types/base";
import { createRequire } from "node:module";
import path from "node:path";
import { readFileSync } from "./read-file";

const singleComment = Symbol("singleComment");
const multiComment = Symbol("multiComment");

const stripWithoutWhitespace = () => "";
const stripWithWhitespace = (value: string, start?: number, end?: number) =>
  value.slice(start, end).replace(/\S/g, " ");

const isEscaped = (jsonString: string, quotePosition: number) => {
  let index = quotePosition - 1;
  let backslashCount = 0;
  while (jsonString[index] === "\\") {
    index -= 1;
    backslashCount += 1;
  }
  return Boolean(backslashCount % 2);
};

const stripJsonComments = (
  jsonString: string,
  { whitespace = true, trailingCommas = false } = {}
) => {
  if (typeof jsonString !== "string") {
    throw new TypeError(
      `Expected argument \`jsonString\` to be a \`string\`, got \`${typeof jsonString}\``
    );
  }

  const strip = whitespace ? stripWithWhitespace : stripWithoutWhitespace;
  let isInsideString: boolean | symbol = false;
  let isInsideComment: boolean | symbol = false;
  let offset = 0;
  let buffer = "";
  let result = "";
  let commaIndex = -1;
  for (let index = 0; index < jsonString.length; index++) {
    const currentCharacter = jsonString[index];
    const nextCharacter = jsonString[index + 1];
    if (!isInsideComment && currentCharacter === '"') {
      const escaped = isEscaped(jsonString, index);
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
      buffer += jsonString.slice(offset, index);
      offset = index;
      isInsideComment = singleComment;
      index++;
    } else if (
      isInsideComment === singleComment &&
      currentCharacter + (nextCharacter ?? EMPTY_STRING) === "\r\n"
    ) {
      index++;
      isInsideComment = false;
      buffer += strip(jsonString, offset, index);
      offset = index;
    } else if (isInsideComment === singleComment && currentCharacter === "\n") {
      isInsideComment = false;
      buffer += strip(jsonString, offset, index);
      offset = index;
    } else if (
      !isInsideComment &&
      currentCharacter + (nextCharacter ?? EMPTY_STRING) === "/*"
    ) {
      buffer += jsonString.slice(offset, index);
      offset = index;
      isInsideComment = multiComment;
      index++;
    } else if (
      isInsideComment === multiComment &&
      currentCharacter + (nextCharacter ?? EMPTY_STRING) === "*/"
    ) {
      index++;
      isInsideComment = false;
      buffer += strip(jsonString, offset, index + 1);
      offset = index + 1;
    } else if (trailingCommas && !isInsideComment) {
      if (commaIndex !== -1) {
        if (currentCharacter === "}" || currentCharacter === "]") {
          buffer += jsonString.slice(offset, index);
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
          buffer += jsonString.slice(offset, index);
          offset = index;
          commaIndex = -1;
        }
      } else if (currentCharacter === ",") {
        result += buffer + jsonString.slice(offset, index);
        buffer = "";
        offset = index;
        commaIndex = index;
      }
    }
  }
  return (
    result +
    buffer +
    (isInsideComment
      ? strip(jsonString.slice(offset))
      : jsonString.slice(offset))
  );
};

const jsoncParse = (data: string) => {
  try {
    // eslint-disable-next-line no-new-func, ts/no-implied-eval, ts/no-unsafe-call
    return new Function(`return ${stripJsonComments(data).trim()}`)();
  } catch {
    return {};
  }
};

const req = createRequire(import.meta.url);
const findUp = (
  name: string,
  startDir: string,
  stopDir = path.parse(startDir).root
) => {
  let dir = startDir;
  while (dir !== stopDir) {
    const file = joinPaths(dir, name);
    if (existsSync(file)) return file;
    if (!file.endsWith(".json")) {
      const fileWithExt = `${file}.json`;
      if (existsSync(fileWithExt)) return fileWithExt;
    }
    dir = path.dirname(dir);
  }
  return null;
};

const resolveTsConfigFromFile = (cwd: string, filename: string) => {
  if (path.isAbsolute(filename)) {
    return existsSync(filename) ? filename : null;
  }
  return findUp(filename, cwd);
};

const resolveTsConfigFromExtends = (cwd: string, name: string) => {
  if (path.isAbsolute(name)) return existsSync(name) ? name : null;
  if (name.startsWith(".")) return findUp(name, cwd);
  const id = req.resolve(name, { paths: [cwd] });

  return id;
};

const loadTsConfigInternal = (
  _dir = process.cwd(),
  name = "tsconfig.json",
  isExtends = false
) => {
  let _a: any;
  let _b: any;

  const dir = path.resolve(_dir);
  const id = isExtends
    ? resolveTsConfigFromExtends(dir, name)
    : resolveTsConfigFromFile(dir, name);

  if (!id) {
    return null;
  }

  const data = jsoncParse(readFileSync(id));
  const configDir = path.dirname(id);

  if ((_a = data.compilerOptions) === null ? void 0 : _a.baseUrl) {
    data.compilerOptions.baseUrl = joinPaths(
      configDir,
      data.compilerOptions.baseUrl
    );
  }
  const extendsFiles = [];
  if (data.extends) {
    const extendsList = Array.isArray(data.extends)
      ? data.extends
      : [data.extends];
    const extendsData: any = {};
    for (const name2 of extendsList) {
      const parentConfig: any = loadTsConfigInternal(configDir, name2, true);
      if (parentConfig) {
        Object.assign(extendsData, {
          ...(parentConfig === null ? void 0 : parentConfig.data),
          compilerOptions: {
            ...extendsData.compilerOptions,

            ...((_b = parentConfig === null ? void 0 : parentConfig.data) ===
            null
              ? void 0
              : _b.compilerOptions)
          }
        });
        extendsFiles.push(...parentConfig.files);
      }
    }
    Object.assign(data, {
      ...extendsData,
      ...data,
      compilerOptions: {
        ...extendsData.compilerOptions,
        ...data.compilerOptions
      }
    });
  }
  data.extends = undefined;
  return {
    path: id,
    data,
    files: [...extendsFiles, id]
  };
};

/**
 * Loads a tsconfig.json file and returns the parsed JSON object.
 *
 * @param dir - The directory to start searching for the tsconfig.json file.
 * @param name - The name of the tsconfig.json file.
 * @returns The parsed JSON object.
 */
export const loadTsConfig = (dir: string, name = "tsconfig.json") =>
  loadTsConfigInternal(dir, name);

/**
 * Loads a tsconfig.json file and returns the parsed JSON object.
 *
 * @param name - The name/path of the tsconfig.json file.
 * @returns The parsed JSON object.
 */
export const loadTsConfigFile = (file: string) =>
  loadTsConfig(findFilePath(file), findFileName(file));
