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

import type {
  DMMF,
  EnvValue,
  GeneratorOptions
} from "@prisma/generator-helper";
import { createDirectory, removeDirectory } from "@stryke/fs/helpers";
import { joinPaths } from "@stryke/path/join-paths";
import { generateAccessControl } from "./access-control";
import { configSchema } from "./config";
import { project } from "./project";
import type { Writeable } from "./types";
import { getPrismaInternals } from "./utils/get-prisma-internals";

export async function generate(options: GeneratorOptions) {
  // eslint-disable-next-line no-console
  console.log(
    "[STORM]: Running the Storm Software - Prisma Better-Auth generator \n"
  );

  const internals = await getPrismaInternals();

  // eslint-disable-next-line no-console
  console.log(`[STORM]: Validating configuration options \n`);

  const outputDir = internals.parseEnvValue(
    options.generator.output as EnvValue
  );
  const results = await configSchema.safeParseAsync(options.generator.config);
  if (!results.success) {
    throw new Error("Invalid options passed");
  }

  const config = results.data;
  const consoleLog = (message: string) => {
    if (config.debug) {
      // eslint-disable-next-line no-console
      console.log(`[STORM]: ${message} \n`);
    }
  };

  consoleLog(`Using configuration parameters: \n${JSON.stringify(config)}`);

  consoleLog(`Preparing output directory: ${outputDir}`);

  await removeDirectory(outputDir);
  await createDirectory(outputDir);

  consoleLog("Finding Prisma Client generator");

  const prismaClientProvider = options.otherGenerators.find(
    it => internals.parseEnvValue(it.provider) === "prisma-client-js"
  );
  if (!prismaClientProvider) {
    throw new Error(
      "No Prisma Client generator found. Please add `prisma-client-js` to your generator list."
    );
  }

  consoleLog("Generating Prisma Client DMMF");

  const prismaClientDmmf = (await internals.getDMMF({
    datamodel: options.datamodel,
    previewFeatures: prismaClientProvider?.previewFeatures
  })) as Writeable<DMMF.Document>;

  const modelOperations = prismaClientDmmf.mappings
    .modelOperations as DMMF.ModelMapping[];

  consoleLog(
    `Generating Better-Auth access control source file to ${outputDir}`
  );

  const accessControl = project.createSourceFile(
    joinPaths(outputDir, "./access-control.ts"),
    undefined,
    { overwrite: true }
  );

  await generateAccessControl(accessControl, modelOperations);

  consoleLog("Saving Better-Auth router source files to disk");

  await project.save();

  consoleLog(
    "Storm Software - Prisma Better-Auth generator completed successfully"
  );
}
