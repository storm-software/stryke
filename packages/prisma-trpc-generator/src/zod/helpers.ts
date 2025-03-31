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

import type { ConnectorType, DMMF } from "@prisma/generator-helper";
import type { Writeable } from "../types";
import { addMissingInputObjectTypesForAggregate } from "./aggregate-helpers";
import { addMissingInputObjectTypesForInclude } from "./include-helpers";
import { addMissingInputObjectTypesForModelArgs } from "./modelArgs-helpers";
import { addMissingInputObjectTypesForMongoDbRawOpsAndQueries } from "./mongodb-helpers";
import { addMissingInputObjectTypesForSelect } from "./select-helpers";
import Transformer from "./transformer";
import { changeOptionalToRequiredFields } from "./whereUniqueInput-helpers";

interface AddMissingInputObjectTypeOptions {
  isGenerateSelect: boolean;
  isGenerateInclude: boolean;
}

export function addMissingZodInputObjectTypes(
  inputObjectTypes: DMMF.InputType[],
  outputObjectTypes: DMMF.OutputType[],
  models: DMMF.Model[],
  modelOperations: DMMF.ModelMapping[],
  dataSourceProvider: ConnectorType,
  options: AddMissingInputObjectTypeOptions
) {
  // TODO: remove once Prisma fix this issue: https://github.com/prisma/prisma/issues/14900
  if (dataSourceProvider === "mongodb") {
    addMissingInputObjectTypesForMongoDbRawOpsAndQueries(
      modelOperations,
      outputObjectTypes,
      inputObjectTypes
    );
  }
  addMissingInputObjectTypesForAggregate(inputObjectTypes, outputObjectTypes);
  if (options.isGenerateSelect) {
    addMissingInputObjectTypesForSelect(
      inputObjectTypes,
      outputObjectTypes,
      models
    );
    Transformer.setIsGenerateSelect(true);
  }
  if (options.isGenerateSelect || options.isGenerateInclude) {
    addMissingInputObjectTypesForModelArgs(
      inputObjectTypes,
      models,
      options.isGenerateSelect,
      options.isGenerateInclude
    );
  }
  if (options.isGenerateInclude) {
    addMissingInputObjectTypesForInclude(
      inputObjectTypes,
      models,
      options.isGenerateSelect
    );
    Transformer.setIsGenerateInclude(true);
  }

  changeOptionalToRequiredFields(
    inputObjectTypes as Writeable<DMMF.InputType[]>
  );
}
