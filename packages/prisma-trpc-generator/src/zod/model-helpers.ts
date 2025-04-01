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
import { lowerCaseFirst } from "@stryke/string-format/lower-case-first";
import path from "node:path";
import type {
  CodeBlockWriter,
  ImportDeclarationStructure,
  SourceFile
} from "ts-morph";
import { StructureKind, VariableDeclarationKind } from "ts-morph";
import type { Config } from "../config";
import { getPrismaInternals } from "../utils/get-prisma-internals";
import { getJSDocs, getZodDocElements } from "./docs-helpers";

export function checkModelHasModelRelation(model: DMMF.Model) {
  const { fields: modelFields } = model;
  for (const modelField of modelFields) {
    const isRelationField = checkIsModelRelationField(modelField);
    if (isRelationField) {
      return true;
    }
  }
  return false;
}

export function checkModelHasManyModelRelation(model: DMMF.Model) {
  const { fields: modelFields } = model;
  for (const modelField of modelFields) {
    const isManyRelationField = checkIsManyModelRelationField(modelField);
    if (isManyRelationField) {
      return true;
    }
  }
  return false;
}

export function checkIsModelRelationField(modelField: DMMF.Field) {
  const { kind, relationName } = modelField;

  return kind === "object" && !!relationName;
}

export function checkIsManyModelRelationField(modelField: DMMF.Field) {
  return checkIsModelRelationField(modelField) && modelField.isList;
}

export function findModelByName(models: DMMF.Model[], modelName: string) {
  return models.find(({ name }) => name === modelName);
}

export const writeArray = (
  writer: CodeBlockWriter,
  array: string[],
  newLine = true
) => array.forEach(line => writer.write(line).conditionalNewLine(newLine));

export const useModelNames = ({
  modelCase,
  modelSuffix,
  relationModel
}: Config) => {
  const formatModelName = (name: string, prefix = "") => {
    if (modelCase === "camelCase") {
      name = name.slice(0, 1).toLowerCase() + name.slice(1);
    }
    return `${prefix}${name}${modelSuffix}`;
  };

  return {
    modelName: (name: string) =>
      formatModelName(name, relationModel === "default" ? "_" : ""),
    relatedModelName: (
      name: string | DMMF.SchemaEnum | DMMF.OutputType | DMMF.SchemaArg
    ) =>
      formatModelName(
        relationModel === "default"
          ? name.toString()
          : `Related${name.toString()}`
      )
  };
};

export const dotSlash = (input: string) => {
  const converted = input
    .replace(/^\\\\\?\\/, "")
    .replace(/\\/g, "/")
    .replace(/\/{2,}/g, "/");

  if (converted.includes(`/node_modules/`))
    return converted.split(`/node_modules/`).slice(-1)[0];

  if (converted.startsWith(`../`)) return converted;

  return `./${converted}`;
};

export const chunk = <T extends any[]>(input: T, size: number): T[] => {
  return input.reduce((arr, item, idx) => {
    return idx % size === 0
      ? [...arr, [item]]
      : [...(arr as T).slice(0, -1), [...(arr as T).slice(-1)[0], item]];
  }, []);
};

export const needsRelatedModel = (model: DMMF.Model, config: Config) =>
  model.fields.some(field => field.kind === "object") &&
  config.relationModel !== false;

export const writeImportsForModel = async (
  model: DMMF.Model,
  sourceFile: SourceFile,
  config: Config,
  options: GeneratorOptions
) => {
  const internals = await getPrismaInternals();

  const outputPath = internals.parseEnvValue(
    options.generator.output as EnvValue
  );

  const { relatedModelName } = useModelNames(config);
  const importList: ImportDeclarationStructure[] = [
    {
      kind: StructureKind.ImportDeclaration,
      namespaceImport: "z",
      moduleSpecifier: "zod"
    }
  ];

  if (config.imports) {
    importList.push({
      kind: StructureKind.ImportDeclaration,
      namespaceImport: "imports",
      moduleSpecifier: dotSlash(
        path.relative(
          outputPath,
          path.resolve(path.dirname(options.schemaPath), config.imports)
        )
      )!
    });
  }

  if (config.useDecimalJs && model.fields.some(f => f.type === "Decimal")) {
    importList.push({
      kind: StructureKind.ImportDeclaration,
      namedImports: ["Decimal"],
      moduleSpecifier: "decimal.js"
    });
  }

  const enumFields = model.fields.filter(f => f.kind === "enum");
  const relationFields = model.fields.filter(f => f.kind === "object");

  const clientPath = options.otherGenerators.find(
    each => each.provider.value === "prisma-client-js"
  )!.output!.value!;

  const relativePath = path.relative(outputPath, clientPath);

  if (enumFields.length > 0) {
    importList.push({
      kind: StructureKind.ImportDeclaration,
      isTypeOnly: enumFields.length === 0,
      moduleSpecifier: dotSlash(relativePath)!,
      namedImports: enumFields.map(f => f.type)
    });
  }

  if (config.relationModel !== false && relationFields.length > 0) {
    const filteredFields = relationFields.filter(f => f.type !== model.name);

    if (filteredFields.length > 0) {
      importList.push({
        kind: StructureKind.ImportDeclaration,
        moduleSpecifier: "./index",
        namedImports: Array.from(
          new Set(
            filteredFields.flatMap(f => [`${f.type}`, relatedModelName(f.type)])
          )
        )
      });
    }
  }

  sourceFile.addImportDeclarations(importList);
};

export const computeCustomSchema = (docString: string) => {
  return getZodDocElements(docString)
    .find(modifier => modifier.startsWith("custom("))
    ?.slice(7)
    .slice(0, -1);
};

export const computeModifiers = (docString: string) => {
  return getZodDocElements(docString).filter(
    each => !each.startsWith("custom(")
  );
};

export const getZodConstructor = (
  field: DMMF.Field,
  getRelatedModelName = (
    name: string | DMMF.SchemaEnum | DMMF.OutputType | DMMF.SchemaArg
  ) => name.toString()
) => {
  let zodType = "z.unknown()";
  const extraModifiers: string[] = [""];
  if (field.kind === "scalar") {
    switch (field.type) {
      case "String":
        zodType = "z.string()";
        break;
      case "Int":
        zodType = "z.number()";
        extraModifiers.push("int()");
        break;
      case "BigInt":
        zodType = "z.bigint()";
        break;
      case "DateTime":
        zodType = "z.date()";
        break;
      case "Float":
        zodType = "z.number()";
        break;
      case "Decimal":
        zodType = "z.number()";
        break;
      case "Json":
        zodType = "jsonSchema";
        break;
      case "Boolean":
        zodType = "z.boolean()";
        break;
      // TODO: Proper type for bytes fields
      case "Bytes":
        zodType = "z.unknown()";
        break;
    }
  } else if (field.kind === "enum") {
    zodType = `z.nativeEnum(${field.type})`;
  } else if (field.kind === "object") {
    zodType = getRelatedModelName(field.type);
  }

  if (field.isList) extraModifiers.push("array()");
  if (field.documentation) {
    zodType = computeCustomSchema(field.documentation) ?? zodType;
    extraModifiers.push(...computeModifiers(field.documentation));
  }
  if (!field.isRequired && field.type !== "Json")
    extraModifiers.push("nullish()");
  // if (field.hasDefaultValue) extraModifiers.push('optional()')

  return `${zodType}${extraModifiers.join(".")}`;
};

export const writeTypeSpecificSchemas = (
  model: DMMF.Model,
  sourceFile: SourceFile,
  config: Config
) => {
  if (model.fields.some(f => f.type === "Json")) {
    sourceFile.addStatements(writer => {
      writer.newLine();
      writeArray(writer, [
        "// Helper schema for JSON fields",
        `type Literal = boolean | number | string${
          config.prismaJsonNullability ? "" : "| null"
        }`,
        "type Json = Literal | { [key: string]: Json } | Json[]",
        `const literalSchema = z.union([z.string(), z.number(), z.boolean()${
          config.prismaJsonNullability ? "" : ", z.null()"
        }])`,
        "const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))"
      ]);
    });
  }

  if (config.useDecimalJs && model.fields.some(f => f.type === "Decimal")) {
    sourceFile.addStatements(writer => {
      writer.newLine();
      writeArray(writer, [
        "// Helper schema for Decimal fields",
        "z",
        ".instanceof(Decimal)",
        ".or(z.string())",
        ".or(z.number())",
        ".refine((value) => {",
        "  try {",
        "    return new Decimal(value);",
        "  } catch (error) {",
        "    return false;",
        "  }",
        "})",
        ".transform((value) => new Decimal(value));"
      ]);
    });
  }
};

export const generateSchemaForModel = (
  model: DMMF.Model,
  sourceFile: SourceFile,
  config: Config
) => {
  const { modelName } = useModelNames(config);

  sourceFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    isExported: true,
    leadingTrivia: writer => writer.blankLineIfLastNot(),
    declarations: [
      {
        name: modelName(model.name),
        initializer(writer) {
          writer
            .write("z.object(")
            .inlineBlock(() => {
              model.fields
                .filter(f => f.kind !== "object")
                .forEach(field => {
                  writeArray(writer, getJSDocs(field.documentation));
                  writer
                    .write(`${field.name}: ${getZodConstructor(field)}`)
                    .write(",")
                    .newLine();
                });
            })
            .write(")");
        }
      }
    ]
  });
};

export const generateRelatedSchemaForModel = (
  model: DMMF.Model,
  sourceFile: SourceFile,
  config: Config
) => {
  const { modelName, relatedModelName } = useModelNames(config);

  const relationFields = model.fields.filter(f => f.kind === "object");

  sourceFile.addInterface({
    name: `${model.name}`,
    isExported: true,
    extends: [`z.infer<typeof ${modelName(model.name)}>`],
    properties: relationFields.map(f => ({
      hasQuestionToken: !f.isRequired,
      name: f.name,
      type: `${f.type}${f.isList ? "[]" : ""}${!f.isRequired ? " | null" : ""}`
    }))
  });

  sourceFile.addStatements(writer =>
    writeArray(writer, [
      "",
      "/**",
      ` * ${relatedModelName(
        model.name
      )} contains all relations on your model in addition to the scalars`,
      " *",
      " * NOTE: Lazy required in case of potential circular dependencies within schema",
      " */"
    ])
  );

  sourceFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    isExported: true,
    declarations: [
      {
        name: relatedModelName(model.name),
        type: `z.ZodSchema<${model.name}>`,
        initializer(writer) {
          writer
            .write(`z.lazy(() => ${modelName(model.name)}.extend(`)
            .inlineBlock(() => {
              relationFields.forEach(field => {
                writeArray(writer, getJSDocs(field.documentation));

                writer
                  .write(
                    `${field.name}: ${getZodConstructor(
                      field,
                      relatedModelName
                    )}`
                  )
                  .write(",")
                  .newLine();
              });
            })
            .write("))");
        }
      }
    ]
  });
};

export const populateModelFile = async (
  model: DMMF.Model,
  sourceFile: SourceFile,
  config: Config,
  options: GeneratorOptions
) => {
  await writeImportsForModel(model, sourceFile, config, options);
  writeTypeSpecificSchemas(model, sourceFile, config);
  generateSchemaForModel(model, sourceFile, config);
  if (needsRelatedModel(model, config))
    generateRelatedSchemaForModel(model, sourceFile, config);
};

export const generateBarrelFile = (
  models: DMMF.Model[],
  indexFile: SourceFile
) => {
  models.forEach(model =>
    indexFile.addExportDeclaration({
      moduleSpecifier: `./${lowerCaseFirst(model.name)}`
    })
  );
};
