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

import { findFilePath, relativePath } from "@stryke/path/file-path-fns";
import { joinPaths } from "@stryke/path/join-paths";

export default function getRelativePath(
  outputPath: string,
  filePath: string,
  isOutsideOutputPath?: boolean,
  schemaPath?: string,
  fromPath?: string
) {
  let toPath = joinPaths(
    outputPath,
    filePath.endsWith(".ts") ? findFilePath(filePath) : filePath
  );
  if (isOutsideOutputPath && schemaPath) {
    toPath = joinPaths(
      schemaPath.endsWith(".prisma") ? findFilePath(schemaPath) : schemaPath,
      filePath
    );
  }

  return relativePath(fromPath || outputPath, toPath);
}
