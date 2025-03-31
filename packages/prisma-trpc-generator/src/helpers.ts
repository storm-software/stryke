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

/* eslint-disable ts/no-use-before-define */

import type {
  DMMF,
  EnvValue,
  GeneratorOptions
} from "@prisma/generator-helper";
import { relativePath } from "@stryke/path/file-path-fns";
import { joinPaths } from "@stryke/path/join-paths";
import { lowerCaseFirst } from "@stryke/string-format/lower-case-first";
import type { SourceFile } from "ts-morph";
import type { Config } from "./config";
import { getPrismaInternals } from "./utils/get-prisma-internals";

const getProcedureName = (config: Config) => {
  return config.withShield
    ? "shieldedProcedure"
    : config.withMiddleware
      ? "protectedProcedure"
      : "publicProcedure";
};

export const generateCreateRouterImport = ({
  sourceFile,
  config
}: {
  sourceFile: SourceFile;
  config?: Config;
}) => {
  const imports = ["t"];

  if (config) {
    imports.push(getProcedureName(config));
  }

  sourceFile.addImportDeclaration({
    moduleSpecifier: "../trpc",
    namedImports: imports
  });
};

export const generateRPCImport = (sourceFile: SourceFile) => {
  sourceFile.addImportDeclaration({
    moduleSpecifier: "@trpc/server",
    namespaceImport: "trpc"
  });
};

export const generateMiddlewareImport = async (
  sourceFile: SourceFile,
  options: GeneratorOptions
) => {
  const internals = await getPrismaInternals();

  const outputDir = internals.parseEnvValue(
    options.generator.output as EnvValue
  );
  sourceFile.addImportDeclaration({
    moduleSpecifier: relativePath(
      outputDir,
      joinPaths(outputDir, "middleware")
    ),
    namedImports: ["permissions"]
  });
};

export const generateRouterImport = (
  sourceFile: SourceFile,
  modelNamePlural: string,
  modelNameCamelCase: string
) => {
  sourceFile.addImportDeclaration({
    moduleSpecifier: `./${modelNameCamelCase}.router`,
    namedImports: [`${modelNamePlural}Router`]
  });
};

export async function generateTRPCExports(
  sourceFile: SourceFile,
  config: Config,
  options: GeneratorOptions,
  outputDir: string
) {
  if (config.withShield) {
    sourceFile.addImportDeclaration({
      moduleSpecifier: relativePath(
        outputDir,
        joinPaths(
          outputDir,
          typeof config.withShield === "string" ? config.withShield : "shield"
        )
      ),
      namedImports: ["permissions"]
    });
  }

  sourceFile.addStatements(
    /* ts */ `import type { Context } from '${relativePath(
      outputDir,
      joinPaths(outputDir, config.contextPath)
    )}';`
  );

  if (config.trpcOptions) {
    sourceFile.addStatements(
      /* ts */ `import trpcOptions from '${
        typeof config.trpcOptions === "string"
          ? relativePath(outputDir, joinPaths(outputDir, config.trpcOptions))
          : "./options"
      }';`
    );
  }

  if (config.withNext) {
    sourceFile.addStatements(/* ts */ `import { createContext } from '${relativePath(
      outputDir,
      joinPaths(outputDir, config.contextPath)
    )}';
    import { initTRPC } from '@trpc/server';
    import { createTRPCServerActionHandler } from '@stryke/trpc-next/action-handler';`);
  }

  sourceFile.addStatements(/* ts */ `
  export const t = initTRPC.context<Context>().create(${
    config.trpcOptions ? "trpcOptions" : ""
  });`);

  const middlewares = [];

  if (config.withMiddleware && typeof config.withMiddleware === "boolean") {
    sourceFile.addStatements(/* ts */ `
    export const globalMiddleware = t.middleware(async ({ ctx, next }) => {
      console.log('inside middleware!')
      return next()
    });`);
    middlewares.push({
      type: "global",
      value: /* ts */ `.use(globalMiddleware)`
    });
  }

  if (config.withMiddleware && typeof config.withMiddleware === "string") {
    sourceFile.addStatements(/* ts */ `
  import defaultMiddleware from '${relativePath(
    outputDir,
    joinPaths(
      outputDir,
      typeof config.withMiddleware === "string"
        ? config.withMiddleware
        : "middleware"
    )
  )}';
  `);
    sourceFile.addStatements(/* ts */ `
    export const globalMiddleware = t.middleware(defaultMiddleware);`);
    middlewares.push({
      type: "global",
      value: /* ts */ `.use(globalMiddleware)`
    });
  }

  if (config.withShield) {
    sourceFile.addStatements(/* ts */ `
    export const permissionsMiddleware = t.middleware(permissions);
    `);

    middlewares.push({
      type: "shield",
      value: /* ts */ `
      .use(permissions)`
    });
  }

  sourceFile.addStatements(/* ts */ `
/**
 * Create a server-side caller
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;`);

  sourceFile.addStatements(/* ts */ `
    export const publicProcedure = t.procedure; `);

  if (middlewares.length > 0) {
    const procName = getProcedureName(config);

    middlewares.forEach((middleware, i) => {
      if (i === 0) {
        sourceFile.addStatements(/* ts */ `
    export const ${procName} = t.procedure`);
      }

      sourceFile.addStatements(
        /* ts */ `.use(${
          middleware.type === "shield"
            ? "permissionsMiddleware"
            : "globalMiddleware"
        })`
      );
    });
  }

  if (config.withNext) {
    sourceFile.addStatements(/* ts */ `
  export const createAction: ReturnType<typeof createTRPCServerActionHandler> =
    createTRPCServerActionHandler(t, createContext);
  `);
  }

  sourceFile.formatText({
    indentSize: 2
  });
}

export function generateProcedure(
  sourceFile: SourceFile,
  name: string,
  typeName: string,
  modelName: string,
  opType: string,
  baseOpType: string,
  config: Config
) {
  let input = `input${!config.withZod ? " as any" : ""}`;
  const nameWithoutModel = name.replace(modelName, "");
  if (nameWithoutModel === "groupBy" && config.withZod) {
    input =
      "{ where: input.where, orderBy: input.orderBy, by: input.by, having: input.having, take: input.take, skip: input.skip }";
  }
  sourceFile.addStatements(/* ts */ `${
    config.showModelNameInProcedure ? name : nameWithoutModel
  }: ${getProcedureName(config)}
  ${config.withZod ? `.input(${typeName})` : ""}.${getProcedureTypeByOpName(
    baseOpType
  )}(async ({ ctx, input }) => {
    const ${name} = await ctx.prisma.${lowerCaseFirst(
      modelName
    )}.${opType.replace("One", "")}(${input});
    return ${name};
  }),`);
}

export function generateRouterSchemaImports(
  sourceFile: SourceFile,
  modelName: string,
  modelActions: string[]
) {
  sourceFile.addStatements(
    /* ts */
    [
      // remove any duplicate import statements
      ...new Set(
        modelActions.map(opName =>
          getRouterSchemaImportByOpName(opName, modelName)
        )
      )
    ].join("\n")
  );
}

export const getRouterSchemaImportByOpName = (
  opName: string,
  modelName: string
) => {
  const opType = opName.replace("OrThrow", "").replace("ManyAndReturn", "");
  const inputType = getInputTypeByOpName(opType, modelName);

  return inputType
    ? `import { ${inputType} } from "../schemas/${opType}${modelName}.schema"; `
    : "";
};

export const getInputTypeByOpName = (opName: string, modelName: string) => {
  let inputType;
  switch (opName) {
    case "findUnique":
      inputType = `${modelName}FindUniqueSchema`;
      break;
    case "findFirst":
      inputType = `${modelName}FindFirstSchema`;
      break;
    case "findMany":
      inputType = `${modelName}FindManySchema`;
      break;
    case "findRaw":
      inputType = `${modelName}FindRawObjectSchema`;
      break;
    case "createOne":
      inputType = `${modelName}CreateOneSchema`;
      break;
    case "createMany":
      inputType = `${modelName}CreateManySchema`;
      break;
    case "createManyAndReturn":
      inputType = `${modelName}CreateManySchema`;
      break;
    case "deleteOne":
      inputType = `${modelName}DeleteOneSchema`;
      break;
    case "deleteMany":
      inputType = `${modelName}DeleteManySchema`;
      break;
    case "updateOne":
      inputType = `${modelName}UpdateOneSchema`;
      break;
    case "updateMany":
      inputType = `${modelName}UpdateManySchema`;
      break;
    case "updateManyAndReturn":
      inputType = `${modelName}UpdateManySchema`;
      break;
    case "upsertOne":
      inputType = `${modelName}UpsertSchema`;
      break;
    case "aggregate":
      inputType = `${modelName}AggregateSchema`;
      break;
    case "aggregateRaw":
      inputType = `${modelName}AggregateRawObjectSchema`;
      break;
    case "groupBy":
      inputType = `${modelName}GroupBySchema`;
      break;
    default:
      // eslint-disable-next-line no-console
      console.log("getInputTypeByOpName: ", { opName, modelName });
  }
  return inputType;
};

export const getProcedureTypeByOpName = (opName: string) => {
  let procType;
  switch (opName) {
    case "findUnique":
    case "findFirst":
    case "findMany":
    case "findRaw":
    case "aggregate":
    case "aggregateRaw":
    case "groupBy":
      procType = "query";
      break;
    case "createOne":
    case "createMany":
    case "createManyAndReturn":
    case "deleteOne":
    case "updateOne":
    case "deleteMany":
    case "updateMany":
    case "updateManyAndReturn":
    case "upsertOne":
      procType = "mutation";
      break;
    default:
      // eslint-disable-next-line no-console
      console.log("getProcedureTypeByOpName: ", { opName });
  }
  return procType;
};

export function resolveModelsComments(
  models: DMMF.Model[],
  hiddenModels: string[]
) {
  // eslint-disable-next-line regexp/no-obscure-range
  const modelAttributeRegex = /(?:@@Gen\.)+[A-z]+\(.+\)/;
  const attributeNameRegex = /\.+[A-Z]+\(+/i;
  const attributeArgsRegex = /\(+[A-Z]+:.+\)/i;

  for (const model of models) {
    if (model.documentation) {
      const attribute = model.documentation?.match(modelAttributeRegex)?.[0];
      const attributeName = attribute
        ?.match(attributeNameRegex)?.[0]
        ?.slice(1, -1);
      if (attributeName !== "model") continue;
      const rawAttributeArgs = attribute
        ?.match(attributeArgsRegex)?.[0]
        ?.slice(1, -1);

      const parsedAttributeArgs: Record<string, unknown> = {};
      if (rawAttributeArgs) {
        const rawAttributeArgsParts = rawAttributeArgs
          .split(":")
          .map(it => it.trim())
          .map(part => (part.startsWith("[") ? part : part.split(",")))
          .flat()
          .map(it => it.trim());

        for (let i = 0; i < rawAttributeArgsParts.length; i += 2) {
          const key = rawAttributeArgsParts[i];
          const value = rawAttributeArgsParts[i + 1];
          parsedAttributeArgs[key!] = JSON.parse(value!);
        }
      }

      if (parsedAttributeArgs.hide) {
        hiddenModels.push(model.name);
      }
    }
  }
}

export const getImports = (
  type: "trpc" | "trpc-shield" | "context",
  newPath?: string
) => {
  let statement = "";
  if (type === "trpc") {
    statement = "import * as trpc from '@trpc/server';\n";
  } else if (type === "trpc-shield") {
    statement = "import { shield, allow } from '@stryke/trpc-next/shield';\n";
  } else if (type === "context") {
    statement = `import type { Context } from '${newPath}';\n`;
  }

  return statement;
};

export const wrapWithObject = ({
  shieldItemLines
}: {
  shieldItemLines: Array<string> | string;
}) => {
  let wrapped = "{";
  wrapped += "\n";
  wrapped += Array.isArray(shieldItemLines)
    ? `  ${shieldItemLines.join(",\r\n")}`
    : `  ${shieldItemLines}`;
  wrapped += "\n";
  wrapped += "}";
  return wrapped;
};

export const wrapWithTrpcShieldCall = ({
  shieldObjectTextWrapped
}: {
  shieldObjectTextWrapped: string;
}) => {
  let wrapped = "shield<Context>(";
  wrapped += "\n";
  wrapped += `  ${shieldObjectTextWrapped}`;
  wrapped += "\n";
  wrapped += ")";
  return wrapped;
};

export const wrapWithExport = ({
  shieldObjectText
}: {
  shieldObjectText: string;
}) => {
  return `export const permissions: ReturnType<typeof shield<Context>> = ${shieldObjectText};`;
};

export const constructShield = async (
  {
    queries,
    mutations,
    subscriptions
  }: {
    queries: Array<string>;
    mutations: Array<string>;
    subscriptions: Array<string>;
  },
  config: Config,
  options: GeneratorOptions,
  outputDir: string
) => {
  if (
    queries.length === 0 &&
    mutations.length === 0 &&
    subscriptions.length === 0
  ) {
    return "";
  }

  let rootItems = "";
  if (queries.length > 0) {
    const queryLinesWrapped = `query: ${wrapWithObject({
      shieldItemLines: queries.map(query => `${query}: allow`)
    })},`;
    rootItems += queryLinesWrapped;
  }
  if (mutations.length > 0) {
    const mutationLinesWrapped = `mutation: ${wrapWithObject({
      shieldItemLines: mutations.map(mutation => `${mutation}: allow`)
    })},`;
    rootItems += mutationLinesWrapped;
  }

  if (subscriptions.length > 0) {
    const subscriptionLinesWrapped = `subscription: ${wrapWithObject({
      shieldItemLines: subscriptions.map(
        subscription => `${subscription}: allow`
      )
    })},`;
    rootItems += subscriptionLinesWrapped;
  }

  if (rootItems.length === 0) {
    return "";
  }

  let shieldText = getImports("trpc-shield");
  shieldText += getImports(
    "context",
    relativePath(outputDir, joinPaths(outputDir, config.contextPath))
  );
  shieldText += "\n\n";
  shieldText += wrapWithExport({
    shieldObjectText: wrapWithTrpcShieldCall({
      shieldObjectTextWrapped: wrapWithObject({ shieldItemLines: rootItems })
    })
  });

  return shieldText;
};

export const constructDefaultOptions = (
  config: Config,
  options: GeneratorOptions,
  outputDir: string
) => {
  return `import { ZodError } from 'zod';${config.withNext ? '\nimport { transformer } from "@stryke/trpc-next/shared";' : ""}
import type {
  DataTransformerOptions,
  RootConfig
} from "@trpc/server/unstable-core-do-not-import";
import type { Context } from "${relativePath(outputDir, joinPaths(outputDir, config.contextPath))}";

interface RuntimeConfigOptions<
  TContext extends object,
  TMeta extends object = object
> extends Partial<
    Omit<
      RootConfig<{
        ctx: TContext;
        meta: TMeta;
        errorShape: any;
        transformer: any;
      }>,
      "$types" | "transformer"
    >
  > {
  /**
   * Use a data transformer
   * @see https://trpc.io/docs/v11/data-transformers
   */
  transformer?: DataTransformerOptions;
}

const options: RuntimeConfigOptions<Context> = {${config.withNext ? "\n transformer," : ""}
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null
      }
    };
  }
};

export default options;
`;
};
