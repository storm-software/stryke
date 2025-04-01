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

import { createDirectory } from "@stryke/fs/helpers";
import { writeFile } from "@stryke/fs/write-file";
import { correctPath } from "@stryke/path/correct-path";
import { findFilePath } from "@stryke/path/file-path-fns";
import path from "node:path";
import { formatFile } from "./format-file";

const indexExports = new Set<string>();

export const addIndexExport = (filePath: string) => {
  indexExports.add(filePath);
};

export const writeFileSafely = async (
  writeLocation: string,
  content: any,
  addToIndex = true
) => {
  const [fileContent] = await Promise.all([
    formatFile(content),
    createDirectory(findFilePath(writeLocation))
  ]);

  await writeFile(writeLocation, fileContent);
  if (addToIndex) {
    addIndexExport(writeLocation);
  }
};

export const writeIndexFile = async (indexPath: string) => {
  const rows = Array.from(indexExports).map(filePath => {
    let relativePath = path.relative(path.dirname(indexPath), filePath);
    if (relativePath.endsWith(".ts")) {
      relativePath = relativePath.slice(0, relativePath.lastIndexOf(".ts"));
    }
    const normalized = correctPath(relativePath);

    return `export * from './${normalized}';`;
  });

  rows.push("export * from './models';");

  await writeFileSafely(indexPath, rows.join("\n"), false);
};
