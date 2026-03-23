/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/licenses/projects/stryke.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://docs.stormsoftware.com/projects/stryke
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

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
