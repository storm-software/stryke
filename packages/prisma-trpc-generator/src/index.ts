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

/**
 * The prisma-trpc-generator library used by Storm Software for building NodeJS applications.
 *
 * @remarks
 * A fork of the prisma-trpc-generator code to work in ESM
 *
 * @packageDocumentation
 */

import generatorHelper from "@prisma/generator-helper";
import { generate } from "./prisma-generator";

generatorHelper.generatorHandler({
  onManifest: () => ({
    defaultOutput: "./generated",
    prettyName: "Prisma tRPC Generator",
    requiresGenerators: ["prisma-client-js"]
  }),
  onGenerate: generate
});
