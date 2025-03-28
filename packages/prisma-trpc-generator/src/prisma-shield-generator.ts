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
import type { GetDMMFOptions } from "@prisma/internals";
import { getWorkspaceRoot } from "@stryke/path/get-workspace-root";
import { joinPaths } from "@stryke/path/join-paths";
import { createJiti } from "jiti";
import { promises as fs } from "node:fs";
import path from "node:path";
import { configSchema } from "./config";
import { constructShield } from "./helpers";
import type { RootType } from "./types";
import removeDir from "./utils/removeDir";
import { writeFileSafely } from "./utils/writeFileSafely";

export async function generateShield(options: GeneratorOptions) {
  const jiti = createJiti(getWorkspaceRoot(), {
    fsCache: joinPaths(getWorkspaceRoot(), "node_modules/.cache/storm", "jiti"),
    interopDefault: true
  });

  const internals = await jiti.import<{
    parseEnvValue: (p: EnvValue) => string;
    getDMMF: (options: GetDMMFOptions) => Promise<DMMF.Document>;
  }>(jiti.esmResolve("@prisma/internals"));

  const outputDir = internals.parseEnvValue(
    options.generator.output as EnvValue
  );
  const results = configSchema.safeParse(options.generator.config);
  if (!results.success) throw new Error("Invalid options passed");
  const config = results.data;

  await fs.mkdir(outputDir, { recursive: true });
  await removeDir(outputDir, true);

  const prismaClientProvider = options.otherGenerators.find(
    it => internals.parseEnvValue(it.provider) === "prisma-client-js"
  );

  const prismaClientDmmf = await internals.getDMMF({
    datamodel: options.datamodel,
    previewFeatures: prismaClientProvider?.previewFeatures
  });

  const queries: RootType = [];
  const mutations: RootType = [];
  const subscriptions: RootType = [];

  prismaClientDmmf.mappings.modelOperations.forEach(modelOperation => {
    const { model: _model, plural: _plural, ...operations } = modelOperation;
    for (const [opType, opNameWithModel] of Object.entries(operations)) {
      if (
        [
          "findUnique",
          "findFirst",
          "findMany",
          "aggregate",
          "groupBy"
        ].includes(opType)
      ) {
        queries.push(opNameWithModel as string);
      }

      if (
        [
          "createOne",
          "deleteOne",
          "updateOne",
          "deleteMany",
          "updateMany",
          "upsertOne"
        ].includes(opType)
      ) {
        mutations.push(opNameWithModel as string);
      }
    }
  });

  queries.sort();
  mutations.sort();
  subscriptions.sort();
  const shieldText = constructShield(
    { queries, mutations, subscriptions },
    config,
    options
  );
  await writeFileSafely(path.join(outputDir, "shield.ts"), shieldText);
}
