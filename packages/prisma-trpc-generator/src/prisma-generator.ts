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
import { promises as fs } from "node:fs";
import path from "node:path";
import pluralize from "pluralize";
import { configSchema } from "./config";
import {
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
import { generateShield } from "./prisma-shield-generator";
import { project } from "./project";
import { getJiti } from "./utils/get-jiti";
import { getPrismaInternals } from "./utils/get-prisma-internals";
import removeDir from "./utils/remove-dir";

export async function generate(options: GeneratorOptions) {
  const internals = await getPrismaInternals();

  const outputDir = internals.parseEnvValue(
    options.generator.output as EnvValue
  );
  const results = configSchema.safeParse(options.generator.config);
  if (!results.success) throw new Error("Invalid options passed");
  const config = results.data;

  await fs.mkdir(outputDir, { recursive: true });
  await removeDir(outputDir, true);

  if (config.withZod !== false) {
    const prismaZodGenerator = await getJiti().import<{
      generate: (options: GeneratorOptions) => Promise<void>;
    }>(getJiti().esmResolve("prisma-zod-generator/lib/prisma-generator"));

    await prismaZodGenerator.generate(options);
  }

  if (config.withShield !== false) {
    const shieldOutputPath = path.join(outputDir, "./shield");
    await generateShield({
      ...options,
      generator: {
        ...options.generator,
        output: {
          fromEnvVar: null,
          ...options.generator.output,
          value: shieldOutputPath
        },
        config: {
          ...options.generator.config,
          contextPath: config.contextPath
        }
      }
    });
  }

  const prismaClientProvider = options.otherGenerators.find(
    it => internals.parseEnvValue(it.provider) === "prisma-client-js"
  );

  const prismaClientDmmf = await internals.getDMMF({
    datamodel: options.datamodel,
    previewFeatures: prismaClientProvider?.previewFeatures
  });

  const modelOperations = prismaClientDmmf.mappings.modelOperations;
  const models = prismaClientDmmf.datamodel.models;
  const hiddenModels: string[] = [];
  resolveModelsComments(models as DMMF.Model[], hiddenModels);
  const createRouter = project.createSourceFile(
    path.resolve(outputDir, "routers", "helpers", "createRouter.ts"),
    undefined,
    { overwrite: true }
  );

  generateRPCImport(createRouter);
  if (config.withShield) {
    await generateShieldImport(createRouter, options, config.withShield);
  }

  await generateBaseRouter(createRouter, config, options);

  createRouter.formatText({
    indentSize: 2
  });

  const appRouter = project.createSourceFile(
    path.resolve(outputDir, "routers", `index.ts`),
    undefined,
    { overwrite: true }
  );

  generateCreateRouterImport({
    sourceFile: appRouter
  });

  const routerStatements = [];

  for (const modelOperation of modelOperations) {
    const { model, ...operations } = modelOperation;
    if (hiddenModels.includes(model)) continue;

    const modelActions = Object.keys(operations).filter<DMMF.ModelAction>(
      (opType): opType is DMMF.ModelAction =>
        config.generateModelActions.includes(
          opType.replace("One", "") as DMMF.ModelAction
        )
    );
    if (!modelActions.length) continue;

    const plural = pluralize(model.toLowerCase());

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
  }

  appRouter.addStatements(/* ts */ `
    export const appRouter = t.router({${routerStatements.join()}})
    `);

  appRouter.formatText({ indentSize: 2 });
  await project.save();
}
