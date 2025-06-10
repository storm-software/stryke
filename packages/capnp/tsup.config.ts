/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/projects/stryke/license.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://docs.stormsoftware.com/projects/stryke
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import type { BuildOptions } from "esbuild";
import { fileURLToPath } from "node:url";
import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "capnp-lib",
    entryPoints: ["src/*.ts"],
    format: ["cjs", "esm"],
    platform: "node",
    outDir: "dist/src",
    clean: true,
    dts: true,
    cjsInterop: true,
    sourcemap: false,
    tsconfig: "./tsconfig.json",
    shims: true,
    bundle: true,
    splitting: true,
    noExternal: ["capnp-es"],
    esbuildOptions: (options: BuildOptions) => {
      options.alias = {
        ...options.alias,
        "@stryke/capnp": fileURLToPath(new URL("src/index.ts", import.meta.url))
      };
    }
  },
  {
    name: "capnp-bin",
    entryPoints: ["bin/capnpc.ts"],
    format: ["cjs", "esm"],
    platform: "node",
    outDir: "dist/bin",
    clean: true,
    dts: true,
    cjsInterop: true,
    sourcemap: false,
    tsconfig: "./tsconfig.json",
    shims: true,
    bundle: true,
    splitting: false,
    noExternal: ["capnp-es"]
  }
]);
