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

import { promises as fs } from "node:fs";
import path from "node:path";

export default async function removeDir(dirPath: string, onlyContent: boolean) {
  const dirEntries = await fs.readdir(dirPath, { withFileTypes: true });
  await Promise.all(
    dirEntries.map(async dirEntry => {
      const fullPath = path.join(dirPath, dirEntry.name);

      return dirEntry.isDirectory()
        ? removeDir(fullPath, false)
        : fs.unlink(fullPath);
    })
  );
  if (!onlyContent) {
    await fs.rmdir(dirPath);
  }
}
