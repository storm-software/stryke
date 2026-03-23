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
