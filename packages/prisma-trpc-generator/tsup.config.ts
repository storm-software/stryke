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

import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "prisma-trpc-generator",
    entryPoints: ["src/*.ts"],
    format: ["cjs", "esm"],
    platform: "node",
    outDir: "dist",
    clean: true,
    dts: false,
    sourcemap: false,
    tsconfig: "./tsconfig.json",
    shims: true,
    bundle: true,
    skipNodeModulesBundle: false,
    external: ["esbuild", "typescript", "@prisma/engines-version"]
  }
]);
