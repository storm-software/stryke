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

import { $, usePwsh } from "zx";
// import { writeSuccess } from "@storm-software/config-tools/logger/console";
import { build } from "esbuild";

usePwsh();

build({
  entryPoints: ["tools/nx/src/plugins/package-build.ts"],
  outdir: "dist/plugins",
  tsconfig: "tools/nx/tsconfig.json",
  packages: "external",
  logLevel: "info",
  bundle: true,
  minify: false,
  outExtension: {
    ".js": ".js"
  },
  format: "cjs",
  platform: "node"
}).then(() => {
  $`echo Stryke workspace plugins build completed successfully!`;

  $`echo All Stryke plugins built successfully`;
});
