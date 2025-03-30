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
import { existsSync } from "@stryke/path/exists";
import { findFilePath } from "@stryke/path/file-path-fns";
import { joinPaths } from "@stryke/path/join-paths";
import { lowerCaseFirst } from "@stryke/string-format/lower-case-first";
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
  generateShieldImport,
  getInputTypeByOpName,
  resolveModelsComments
} from "./helpers";
import { project } from "./project";
import type { RootType, Writeable } from "./types";
import { getPrismaInternals } from "./utils/get-prisma-internals";
import { writeFileSafely } from "./utils/write-file-safely";
import { resolveZodAggregateOperationSupport } from "./zod-helpers/aggregate-helpers";
import {
  hideZodInputObjectTypesAndRelatedFields,
  resolveZodModelsComments
} from "./zod-helpers/comments-helpers";
import {
  generateZodEnumSchemas,
  generateZodIndex,
  generateZodModelSchemas,
  generateZodObjectSchemas
} from "./zod-helpers/generator-helpers";
import { addMissingZodInputObjectTypes } from "./zod-helpers/helpers";
import Transformer from "./zod-helpers/transformer";

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
  const inputObjectTypes = prismaClientDmmf.schema.inputObjectTypes
    .prisma as DMMF.InputType[];
  const outputObjectTypes = prismaClientDmmf.schema.outputObjectTypes
    .prisma as DMMF.OutputType[];
  const enumTypes = prismaClientDmmf.schema.enumTypes;
  const models = prismaClientDmmf.datamodel.models as Writeable<DMMF.Model[]>;
  const hiddenModels: string[] = [];
  const hiddenFields: string[] = [];

  if (config.withZod !== false) {
    consoleLog("Generating Zod schemas");

    const zodOutputPath = internals.parseEnvValue(options.generator.output!);

    await createDirectory(zodOutputPath);
    Transformer.setOutputPath(zodOutputPath);

    if (prismaClientProvider?.isCustomOutput) {
      Transformer.setPrismaClientOutputPath(
        prismaClientProvider.output?.value as string
      );
    }

    resolveZodModelsComments(
      models,
      modelOperations,
      enumTypes,
      hiddenModels,
      hiddenFields
    );

    await generateZodEnumSchemas(enumTypes.prisma, enumTypes.model!);

    const dataSource = options.datasources?.[0];
    if (!dataSource) {
      throw new Error("No datasource found");
    }

    const previewFeatures = prismaClientProvider?.previewFeatures;
    Transformer.provider = dataSource.provider;
    Transformer.previewFeatures = previewFeatures;

    addMissingZodInputObjectTypes(
      inputObjectTypes,
      outputObjectTypes,
      models,
      modelOperations,
      dataSource.provider,
      {
        isGenerateSelect: true,
        isGenerateInclude: true
      }
    );

    const aggregateOperationSupport =
      resolveZodAggregateOperationSupport(inputObjectTypes);

    hideZodInputObjectTypesAndRelatedFields(
      inputObjectTypes,
      hiddenModels,
      hiddenFields
    );

    await generateZodObjectSchemas(
      inputObjectTypes as Writeable<DMMF.InputType[]>
    );

    await generateZodModelSchemas(
      models,
      modelOperations,
      aggregateOperationSupport
    );
    await generateZodIndex();
  } else {
    consoleLog("Skipping Zod schemas generation");
  }

  const queries: RootType = [];
  const mutations: RootType = [];
  const subscriptions: RootType = [];

  prismaClientDmmf.mappings.modelOperations.forEach(modelOperation => {
    const { model: _model, plural: _plural, ...operations } = modelOperation;
    for (const [opType, opNameWithModel] of Object.entries(operations)) {
      if (
        [
          "findUnique",
          "findUniqueOrThrow",
          "findFirst",
          "findFirstOrThrow",
          "findRaw",
          "findMany",
          "aggregateRaw",
          "count",
          "aggregate",
          "groupBy"
        ].includes(opType)
      ) {
        queries.push(opNameWithModel as string);
      }

      if (
        [
          "createOne",
          "createMany",
          "createManyAndReturn",
          "deleteOne",
          "deleteMany",
          "updateOne",
          "updateMany",
          "updateManyAndReturn",
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

  if (config.withShield !== false) {
    consoleLog("Generating tRPC Shield");

    if (
      typeof config.withShield === "string" &&
      (existsSync(config.withShield) ||
        existsSync(joinPaths(config.withShield, "shield.ts")))
    ) {
      consoleLog(
        "Skipping  tRPC Shield generation as path provided already exists"
      );
    } else {
      consoleLog("Constructing tRPC Shield source file");

      const shieldOutputDir =
        typeof config.withShield === "string"
          ? findFilePath(config.withShield)
          : outputDir;

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
              value: outputDir
            },
            config: {
              ...options.generator.config,
              contextPath: config.contextPath
            }
          }
        },
        shieldOutputDir
      );

      consoleLog("Saving tRPC Shield source file to disk");

      await writeFileSafely(
        joinPaths(shieldOutputDir, "shield.ts"),
        shieldText
      );
    }
  } else {
    consoleLog("Skipping tRPC Shield generation");
  }

  consoleLog(`Generating tRPC source code for ${models.length} models`);

  if (config.trpcOptions && typeof config.trpcOptions === "boolean") {
    const trpcOptionsOutputPath = joinPaths(outputDir, "options.ts");

    consoleLog("Generating tRPC options source file");

    await writeFileSafely(
      trpcOptionsOutputPath,
      `import { ZodError } from 'zod';${config.withNext ? '\nimport { transformer } from "@stryke/trpc-next/shared";' : ""}

export default {${config.withNext ? "\n transformer," : ""}
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  },
};
`
    );
  }

  resolveModelsComments(models, hiddenModels);
  const createRouter = project.createSourceFile(
    path.resolve(outputDir, "trpc.ts"),
    undefined,
    { overwrite: true }
  );

  consoleLog("Generating tRPC imports");

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
    if (!model) {
      consoleLog(`Skipping model ${model} as it is not defined`);
      continue;
    }

    const modelActions = Object.keys(operations).filter<DMMF.ModelAction>(
      (opType): opType is DMMF.ModelAction =>
        // eslint-disable-next-line unicorn/prefer-includes
        config.generateModelActions.some(
          generateModelAction =>
            generateModelAction === opType.replace("One", "")
        )
    );
    if (!modelActions.length) {
      consoleLog(`Skipping model ${model} as it has no actions to generate`);
      continue;
    }

    const plural = pluralize(lowerCaseFirst(model)!);

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
      if (opNameWithModel) {
        const baseOpType = opType.replace("OrThrow", "");

        generateProcedure(
          modelRouter,
          opNameWithModel,
          getInputTypeByOpName(baseOpType, model)!,
          model,
          opType,
          baseOpType,
          config
        );
      }
    }

    modelRouter.addStatements(/* ts */ `
    })`);

    modelRouter.formatText({ indentSize: 2 });
    routerStatements.push(/* ts */ `
      ${lowerCaseFirst(model)}: ${plural}Router`);

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
