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
import { checkModelHasModelRelation } from "./model-helpers";

export function addMissingInputObjectTypesForModelArgs(
  inputObjectTypes: DMMF.InputType[],
  models: DMMF.Model[],
  isGenerateSelect: boolean,
  isGenerateInclude: boolean
) {
  const modelArgsInputObjectTypes = generateModelArgsInputObjectTypes(
    models,
    isGenerateSelect,
    isGenerateInclude
  );

  for (const modelArgsInputObjectType of modelArgsInputObjectTypes) {
    inputObjectTypes.push(modelArgsInputObjectType);
  }
}
function generateModelArgsInputObjectTypes(
  models: DMMF.Model[],
  isGenerateSelect: boolean,
  isGenerateInclude: boolean
) {
  const modelArgsInputObjectTypes: DMMF.InputType[] = [];
  for (const model of models) {
    const { name: modelName } = model;
    const fields: DMMF.SchemaArg[] = [];

    if (isGenerateSelect) {
      const selectField: DMMF.SchemaArg = {
        name: "select",
        isRequired: false,
        isNullable: false,
        inputTypes: [
          {
            isList: false,
            type: `${modelName}Select`,
            location: "inputObjectTypes",
            namespace: "prisma"
          }
        ]
      };
      fields.push(selectField);
    }

    const hasRelationToAnotherModel = checkModelHasModelRelation(model);

    if (isGenerateInclude && hasRelationToAnotherModel) {
      const includeField: DMMF.SchemaArg = {
        name: "include",
        isRequired: false,
        isNullable: false,
        inputTypes: [
          {
            isList: false,
            type: `${modelName}Include`,
            location: "inputObjectTypes",
            namespace: "prisma"
          }
        ]
      };
      fields.push(includeField);
    }

    const modelArgsInputObjectType: DMMF.InputType = {
      name: `${modelName}Args`,
      constraints: {
        maxNumFields: null,
        minNumFields: null
      },
      fields
    };
    modelArgsInputObjectTypes.push(modelArgsInputObjectType);
  }
  return modelArgsInputObjectTypes;
}
