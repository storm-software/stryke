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
