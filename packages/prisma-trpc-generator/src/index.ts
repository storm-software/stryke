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

import { generate } from "./prisma-generator";
import { getPrismaGeneratorHelper } from "./utils/getPrismaInternals";

getPrismaGeneratorHelper()
  .then(helpers => {
    helpers.generatorHandler({
      onManifest: () => ({
        defaultOutput: "./generated",
        prettyName: "Storm Software - Prisma tRPC Generator",
        requiresGenerators: ["prisma-client-js"]
      }),
      onGenerate: generate
    });
  })
  .catch(reason => {
    // eslint-disable-next-line no-console
    console.error(
      `An error occured while generating prisma tRPC source code: ${reason}`
    );
  });
