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

import type { DMMF } from "@prisma/generator-helper";
import Transformer from "./transformer";

export function addMissingInputObjectTypesForMongoDbRawOpsAndQueries(
  modelOperations: DMMF.ModelMapping[],
  outputObjectTypes: DMMF.OutputType[],
  inputObjectTypes: DMMF.InputType[]
) {
  const rawOpsMap = resolveMongoDbRawOperations(modelOperations);
  Transformer.rawOpsMap = rawOpsMap ?? {};

  const mongoDbRawQueryInputObjectTypes =
    resolveMongoDbRawQueryInputObjectTypes(outputObjectTypes);
  for (const mongoDbRawQueryInputType of mongoDbRawQueryInputObjectTypes) {
    inputObjectTypes.push(mongoDbRawQueryInputType);
  }
}

function resolveMongoDbRawOperations(modelOperations: DMMF.ModelMapping[]) {
  const rawOpsMap: { [name: string]: string } = {};
  const rawOpsNames = [
    ...new Set(
      modelOperations.reduce<string[]>((result, current) => {
        const keys = Object.keys(current);
        keys?.forEach(key => {
          if (key.includes("Raw")) {
            result.push(key);
          }
        });
        return result;
      }, [])
    )
  ];

  const modelNames = modelOperations.map(item => item.model);

  rawOpsNames.forEach(opName => {
    modelNames.forEach(modelName => {
      const isFind = opName === "findRaw";
      const opWithModel = `${opName.replace("Raw", "")}${modelName}Raw`;
      rawOpsMap[opWithModel] = isFind
        ? `${modelName}FindRawArgs`
        : `${modelName}AggregateRawArgs`;
    });
  });

  return rawOpsMap;
}

function resolveMongoDbRawQueryInputObjectTypes(
  outputObjectTypes: DMMF.OutputType[]
) {
  const mongoDbRawQueries = getMongoDbRawQueries(outputObjectTypes);
  const mongoDbRawQueryInputObjectTypes = mongoDbRawQueries.map(item => ({
    name: item.name,
    constraints: {
      maxNumFields: null,
      minNumFields: null
    },
    fields: item.args.map(arg => ({
      name: arg.name,
      isRequired: arg.isRequired,
      isNullable: arg.isNullable,
      inputTypes: arg.inputTypes
    }))
  }));

  return mongoDbRawQueryInputObjectTypes;
}

function getMongoDbRawQueries(outputObjectTypes: DMMF.OutputType[]) {
  const queryOutputTypes = outputObjectTypes.filter(
    item => item.name === "Query"
  );

  const mongodbRawQueries =
    queryOutputTypes?.[0]!.fields.filter(field => field.name.includes("Raw")) ??
    [];

  return mongodbRawQueries;
}

export const isMongodbRawOp = (name: string) =>
  /find[\s\S]*?Raw/.test(name) || /aggregate[\s\S]*?Raw/.test(name);
