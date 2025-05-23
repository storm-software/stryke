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
import type { SchemaArgInputTypes } from "../types";
import {
  checkIsModelRelationField,
  checkModelHasManyModelRelation,
  checkModelHasModelRelation
} from "./model-helpers";

export function addMissingInputObjectTypesForInclude(
  inputObjectTypes: DMMF.InputType[],
  models: DMMF.Model[],
  isGenerateSelect: boolean
) {
  // generate input object types necessary to support ModelInclude with relation support
  const generatedIncludeInputObjectTypes = generateModelIncludeInputObjectTypes(
    models,
    isGenerateSelect
  );

  for (const includeInputObjectType of generatedIncludeInputObjectTypes) {
    inputObjectTypes.push(includeInputObjectType);
  }
}

function generateModelIncludeInputObjectTypes(
  models: DMMF.Model[],
  isGenerateSelect: boolean
) {
  const modelIncludeInputObjectTypes: DMMF.InputType[] = [];
  for (const model of models) {
    const { name: modelName, fields: modelFields } = model;
    const fields: DMMF.SchemaArg[] = [];

    for (const modelField of modelFields) {
      const { name: modelFieldName, isList, type } = modelField;

      const isRelationField = checkIsModelRelationField(modelField);

      if (isRelationField) {
        const field: DMMF.SchemaArg = {
          name: modelFieldName,
          isRequired: false,
          isNullable: false,
          inputTypes: [
            { isList: false, type: "Boolean", location: "scalar" },
            {
              isList: false,
              type: isList ? `${type}FindManyArgs` : `${type}DefaultArgs`,
              location: "inputObjectTypes",
              namespace: "prisma"
            }
          ]
        };
        fields.push(field);
      }
    }

    /**
     * include is not generated for models that do not have a relation with any other models continue onto the next model
     */
    const hasRelationToAnotherModel = checkModelHasModelRelation(model);
    if (!hasRelationToAnotherModel) {
      continue;
    }

    const hasManyRelationToAnotherModel = checkModelHasManyModelRelation(model);

    const shouldAddCountField = hasManyRelationToAnotherModel;
    if (shouldAddCountField) {
      const inputTypes: SchemaArgInputTypes = [
        { isList: false, type: "Boolean", location: "scalar" }
      ];
      if (isGenerateSelect) {
        inputTypes.push({
          isList: false,
          type: `${modelName}CountOutputTypeDefaultArgs`,
          location: "inputObjectTypes",
          namespace: "prisma"
        });
      }
      const _countField: DMMF.SchemaArg = {
        name: "_count",
        isRequired: false,
        isNullable: false,
        inputTypes
      };
      fields.push(_countField);
    }

    const modelIncludeInputObjectType: DMMF.InputType = {
      name: `${modelName}Include`,
      constraints: {
        maxNumFields: null,
        minNumFields: null
      },
      fields
    };
    modelIncludeInputObjectTypes.push(modelIncludeInputObjectType);
  }
  return modelIncludeInputObjectTypes;
}
