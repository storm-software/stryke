/*-------------------------------------------------------------------

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

 -------------------------------------------------------------------*/

import { $, chalk, echo, usePwsh } from "zx";

usePwsh();

await $`nx run-many --target=lint,format --all --exclude="@storm-stack/monorepo" --parallel=5`.timeout(
  `${30 * 60}s`
);
await $`nx format:write`.timeout(`${30 * 60}s`);

echo`${chalk.green("Successfully formatted the monorepo's files")}`;
