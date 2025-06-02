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

import { getParentPath, isAbsolutePath, slash } from "@stryke/path";
import { existsSync } from "@stryke/path/exists";
import { findFileName, findFilePath } from "@stryke/path/file-path-fns";
import { joinPaths } from "@stryke/path/join-paths";
import { EMPTY_STRING } from "@stryke/types/base";
import type { TsConfigJson } from "@stryke/types/tsconfig";
import defu from "defu";
import { createRequire } from "node:module";
import { readFile, readFileSync } from "./read-file";

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
function resolveTsConfigFromFile(cwd: string, fileName: string) {
  if (isAbsolutePath(fileName)) {
    return existsSync(fileName) ? fileName : null;
  }

  const name = fileName.endsWith(".json") ? fileName : `${fileName}.json`;
  if (existsSync(joinPaths(cwd, name))) {
    return joinPaths(cwd, name);
  }

  return getParentPath(name, cwd, {
    ignoreCase: true,
    skipCwd: true,
    targetType: "file"
  });
}

function resolveTsConfigFromExtends(cwd: string, extendsName: string) {
  if (isAbsolutePath(extendsName)) {
    return existsSync(extendsName) ? extendsName : null;
  }

  const name = extendsName.endsWith(".json")
    ? extendsName
    : `${extendsName}.json`;
  if (existsSync(joinPaths(cwd, name))) {
    return joinPaths(cwd, name);
  }

  if (name.startsWith(".")) {
    return getParentPath(findFileName(name), cwd, {
      ignoreCase: true,
      skipCwd: false,
      targetType: "file"
    });
  }

  return req.resolve(extendsName, { paths: [cwd] });
}

export interface LoadTsConfigResult {
  path: string;
  data: TsConfigJson;
  files: string[];
}

async function loadTsConfigInternal(
  filePath: string,
  fileName: string,
  isExtends = false
): Promise<LoadTsConfigResult | null> {
  const id = isExtends
    ? resolveTsConfigFromExtends(slash(filePath), fileName)
    : resolveTsConfigFromFile(slash(filePath), fileName);
  if (!id) {
    return null;
  }

  let data = jsoncParse(await readFile(id));
  const configFilePath = findFilePath(id);

  if (data?.compilerOptions?.baseUrl) {
    data.compilerOptions.baseUrl = joinPaths(
      configFilePath,
      data.compilerOptions.baseUrl
    );
  }

  const extendsFiles = [] as string[];
  if (data.extends) {
    const extendsList = Array.isArray(data.extends)
      ? data.extends
      : [data.extends];

    for (const extendsName of extendsList) {
      const parentConfig = await loadTsConfigInternal(
        configFilePath,
        extendsName,
        true
      );
      if (parentConfig) {
        data = defu(data, parentConfig.data ?? {});
        extendsFiles.push(...parentConfig.files);
      }
    }
  }

  data.extends = undefined;
  return {
    path: id,
    data,
    files: [...extendsFiles, id]
  };
}

function loadTsConfigInternalSync(
  filePath: string,
  fileName: string,
  isExtends = false
): LoadTsConfigResult | null {
  const id = isExtends
    ? resolveTsConfigFromExtends(slash(filePath), fileName)
    : resolveTsConfigFromFile(slash(filePath), fileName);
  if (!id) {
    return null;
  }

  let data = jsoncParse(readFileSync(id));
  const configFilePath = findFilePath(id);

  if (data?.compilerOptions?.baseUrl) {
    data.compilerOptions.baseUrl = joinPaths(
      configFilePath,
      data.compilerOptions.baseUrl
    );
  }

  const extendsFiles = [] as string[];
  if (data.extends) {
    const extendsList = Array.isArray(data.extends)
      ? data.extends
      : [data.extends];

    for (const extendsName of extendsList) {
      const parentConfig = loadTsConfigInternalSync(
        configFilePath,
        extendsName,
        true
      );
      if (parentConfig) {
        data = defu(data, parentConfig.data ?? {});
        extendsFiles.push(...parentConfig.files);
      }
    }
  }

  data.extends = undefined;
  return {
    path: id,
    data,
    files: [...extendsFiles, id]
  };
}

/**
 * Loads a tsconfig.json file and returns the parsed JSON object.
 *
 * @param filePath - The directory to start searching for the tsconfig.json file.
 * @param fileName - The name of the tsconfig.json file.
 * @returns The parsed tsconfig.json object or null if not found.
 */
export async function loadTsConfig(
  filePath: string,
  fileName?: string
): Promise<LoadTsConfigResult | null> {
  return loadTsConfigInternal(
    findFilePath(filePath) ? findFilePath(filePath) : process.cwd(),
    fileName ? findFileName(fileName) : "tsconfig.json"
  );
}

/**
 * Synchronously loads a tsconfig.json file and returns the parsed JSON object.
 *
 * @param filePath - The directory to start searching for the tsconfig.json file.
 * @param fileName - The name of the tsconfig.json file.
 * @returns The parsed tsconfig.json object or null if not found.
 */
export function loadTsConfigSync(
  filePath: string,
  fileName?: string
): LoadTsConfigResult | null {
  return loadTsConfigInternalSync(
    findFilePath(filePath) ? findFilePath(filePath) : process.cwd(),
    fileName ? findFileName(fileName) : "tsconfig.json"
  );
}
