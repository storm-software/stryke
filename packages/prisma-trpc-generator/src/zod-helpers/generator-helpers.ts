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
import type { AggregateOperationSupport, Writeable } from "../types";
import Transformer from "./transformer";

export async function generateZodEnumSchemas(
  prismaSchemaEnum: Writeable<DMMF.SchemaEnum[]>,
  modelSchemaEnum: Writeable<DMMF.SchemaEnum[]>
) {
  const enumTypes = [...prismaSchemaEnum, ...modelSchemaEnum];
  const enumNames = enumTypes.map(enumItem => enumItem.name);
  Transformer.enumNames = enumNames ?? [];
  const transformer = new Transformer({
    enumTypes
  });
  await transformer.generateEnumSchemas();
}

export async function generateZodObjectSchemas(
  inputObjectTypes: Writeable<DMMF.InputType[]>
) {
  for (let i = 0; i < inputObjectTypes.length; i += 1) {
    const fields = inputObjectTypes[i]?.fields;
    const name = inputObjectTypes[i]?.name;
    const transformer = new Transformer({ name, fields });
    await transformer.generateObjectSchema();
  }
}

export async function generateZodModelSchemas(
  models: Writeable<DMMF.Model[]>,
  modelOperations: Writeable<DMMF.ModelMapping[]>,
  aggregateOperationSupport: AggregateOperationSupport
) {
  const transformer = new Transformer({
    models,
    modelOperations,
    aggregateOperationSupport
  });
  await transformer.generateModelSchemas();
}

export async function generateZodIndex() {
  await Transformer.generateIndex();
}
