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
import { findFilePath } from "@stryke/path/file-path-fns";
import { formatFile } from "./format-file";

export const writeFileSafely = async (writeLocation: string, content: any) => {
  const [fileContent] = await Promise.all([
    formatFile(content),
    createDirectory(findFilePath(writeLocation))
  ]);
  await writeFile(writeLocation, fileContent);
};
