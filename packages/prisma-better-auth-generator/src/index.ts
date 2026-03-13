/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/licenses/projects/stryke.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://docs.stormsoftware.com/projects/stryke
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

/**
 * The prisma-better-auth-generator library used by Storm Software for building NodeJS applications.
 *
 * @remarks
 * A package containing a Prisma v6 generator for Better-Auth authentication
 *
 * @packageDocumentation
 */

import { generate } from "./prisma-generator";
import { getPrismaGeneratorHelper } from "./utils/get-prisma-internals";

getPrismaGeneratorHelper()
  .then(helpers => {
    helpers.generatorHandler({
      onManifest: () => ({
        defaultOutput: "./generated",
        prettyName: "Storm Software - Prisma Better-Auth Generator",
        requiresGenerators: ["prisma-client-js"]
      }),
      onGenerate: generate
    });
  })
  .catch(reason => {
    // eslint-disable-next-line no-console
    console.error(
      `An error occured while generating prisma Better-Auth source code: ${reason}`
    );
  });
