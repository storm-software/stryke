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
import { createDirectory } from "@stryke/fs/helpers";
import { joinPaths } from "@stryke/path/join-paths";
import path from "node:path";
import pluralize from "pluralize";
import { configSchema } from "./config";
import {
  constructShield,
  generateBaseRouter,
  generateCreateRouterImport,
  generateProcedure,
  generateRouterImport,
  generateRouterSchemaImports,
  generateRPCImport,
  generateShieldImport,
  getInputTypeByOpName,
  resolveModelsComments
} from "./helpers";
import { project } from "./project";
import type { RootType } from "./types";
import { getJiti } from "./utils/get-jiti";
import { getPrismaInternals } from "./utils/get-prisma-internals";
import removeDir from "./utils/remove-dir";
import { writeFileSafely } from "./utils/write-file-safely";

export async function generate(options: GeneratorOptions) {
  // eslint-disable-next-line no-console
  console.log("[STORM]: Running the Storm Software - Prisma tRPC generator");

  const internals = await getPrismaInternals();

  // eslint-disable-next-line no-console
  console.log(`[STORM]: Validating configuration options`);

  const outputDir = internals.parseEnvValue(
    options.generator.output as EnvValue
  );
  const results = configSchema.safeParse(options.generator.config);
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

  consoleLog(`Preparing output directory: ${outputDir}`);

  await createDirectory(outputDir);
  await removeDir(outputDir, true);

  if (config.withZod !== false) {
    consoleLog("Generating Zod schemas");

    const prismaZodGenerator = await getJiti().import<{
      generate: (options: GeneratorOptions) => Promise<void>;
    }>(getJiti().esmResolve("prisma-zod-generator/lib/prisma-generator"));

    await prismaZodGenerator.generate(options);
  } else {
    consoleLog("Skipping Zod schemas generation");
  }

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

  const prismaClientDmmf = await internals.getDMMF({
    datamodel: options.datamodel,
    previewFeatures: prismaClientProvider?.previewFeatures
  });

  const modelOperations = prismaClientDmmf.mappings.modelOperations;
  const models = prismaClientDmmf.datamodel.models;
  const hiddenModels: string[] = [];

  if (config.withShield !== false) {
    consoleLog("Generating tRPC Shield");

    const shieldOutputDir = joinPaths(outputDir, "shield");

    consoleLog("Preparing tRPC Shield output directory");

    await createDirectory(shieldOutputDir);
    await removeDir(shieldOutputDir, true);

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

    consoleLog("Constructing tRPC Shield source file");

    const shieldText = await constructShield(
      { queries, mutations, subscriptions },
      config,
      {
        ...options,
        generator: {
          ...options.generator,
          output: {
            fromEnvVar: null,
            ...options.generator.output,
            value: shieldOutputDir
          },
          config: {
            ...options.generator.config,
            contextPath: config.contextPath
          }
        }
      }
    );

    consoleLog("Saving tRPC Shield source file to disk");

    await writeFileSafely(joinPaths(shieldOutputDir, "shield.ts"), shieldText);
  } else {
    consoleLog("Skipping tRPC Shield generation");
  }

  consoleLog(`Generating tRPC source code for ${models.length} models`);

  resolveModelsComments(models as DMMF.Model[], hiddenModels);
  const createRouter = project.createSourceFile(
    path.resolve(outputDir, "routers", "helpers", "createRouter.ts"),
    undefined,
    { overwrite: true }
  );

  consoleLog("Generating tRPC imports");

  generateRPCImport(createRouter);
  if (config.withShield) {
    await generateShieldImport(createRouter, options, config.withShield);
  }

  consoleLog("Generating tRPC base router");

  await generateBaseRouter(createRouter, config, options);

  createRouter.formatText({
    indentSize: 2
  });

  const appRouter = project.createSourceFile(
    path.resolve(outputDir, "routers", `index.ts`),
    undefined,
    { overwrite: true }
  );

  consoleLog("Generating tRPC router imports");

  generateCreateRouterImport({
    sourceFile: appRouter
  });

  const routerStatements = [];

  for (const modelOperation of modelOperations) {
    const { model, ...operations } = modelOperation;
    if (hiddenModels.includes(model)) {
      consoleLog(`Skipping model ${model} as it is hidden`);
      continue;
    }

    const modelActions = Object.keys(operations).filter<DMMF.ModelAction>(
      (opType): opType is DMMF.ModelAction =>
        config.generateModelActions.includes(
          opType.replace("One", "") as DMMF.ModelAction
        )
    );
    if (!modelActions.length) {
      consoleLog(`Skipping model ${model} as it has no actions to generate`);
      continue;
    }

    const plural = pluralize(model.toLowerCase());

    consoleLog(`Generating tRPC router for model ${model}`);

    generateRouterImport(appRouter, plural, model);
    const modelRouter = project.createSourceFile(
      path.resolve(outputDir, "routers", `${model}.router.ts`),
      undefined,
      { overwrite: true }
    );

    generateCreateRouterImport({
      sourceFile: modelRouter,
      config
    });

    if (config.withZod) {
      consoleLog("Generating Zod schemas imports");
      generateRouterSchemaImports(modelRouter, model, modelActions);
    }

    modelRouter.addStatements(/* ts */ `
      export const ${plural}Router = t.router({`);

    for (const opType of modelActions) {
      const opNameWithModel = operations[opType];
      const baseOpType = opType.replace("OrThrow", "");

      generateProcedure(
        modelRouter,
        opNameWithModel!,
        getInputTypeByOpName(baseOpType, model)!,
        model,
        opType,
        baseOpType,
        config
      );
    }

    modelRouter.addStatements(/* ts */ `
    })`);

    modelRouter.formatText({ indentSize: 2 });
    routerStatements.push(/* ts */ `
      ${model.toLowerCase()}: ${plural}Router`);

    consoleLog(
      `Generated tRPC router for model ${model} with ${modelActions.length} actions`
    );
  }

  consoleLog("Generating tRPC app router");

  appRouter.addStatements(/* ts */ `
    export const appRouter = t.router({${routerStatements.join()}})
    `);

  appRouter.formatText({ indentSize: 2 });

  consoleLog("Saving tRPC router source files to disk");

  await project.save();

  consoleLog("Storm Software - Prisma tRPC generator completed successfully");
}
