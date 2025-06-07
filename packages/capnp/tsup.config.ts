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

import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "capnp",
    entryPoints: ["src/*.ts", "bin/capnpc.ts"],
    format: ["cjs", "esm"],
    platform: "node",
    outDir: "dist",
    clean: true,
    dts: true,
    cjsInterop: true,
    sourcemap: false,
    tsconfig: "./tsconfig.json",
    shims: true,
    bundle: true,
    splitting: true
  }
]);
