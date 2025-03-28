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

import path from "node:path";

export default function getRelativePath(
  outputPath: string,
  filePath: string,
  isOutsideOutputPath?: boolean,
  schemaPath?: string
) {
  const fromPath = path.join(outputPath, "routers", "helpers");
  let toPath = path.join(outputPath, filePath);

  if (isOutsideOutputPath) {
    const schemaPathSplit = schemaPath?.split(path.sep);
    const schemaPathWithoutFileAndExtension = schemaPathSplit!
      .slice(0, schemaPathSplit!.length - 1)
      .join(path.posix.sep);
    toPath = path.join(schemaPathWithoutFileAndExtension, filePath);
  }

  const newPath = path
    .relative(fromPath, toPath)
    .split(path.sep)
    .join(path.posix.sep);

  return newPath;
}
