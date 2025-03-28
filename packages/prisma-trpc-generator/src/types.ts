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

import type { DMMF as PrismaDMMF } from "@prisma/client/runtime";

export interface TransformerParams {
  enumTypes?: PrismaDMMF.SchemaEnum[];
  fields?: PrismaDMMF.SchemaArg[];
  name?: string;
  models?: PrismaDMMF.Model[];
  modelOperations?: PrismaDMMF.ModelMapping[];
  aggregateOperationSupport?: AggregateOperationSupport;
  isDefaultPrismaClientOutput?: boolean;
  prismaClientOutputPath?: string;
}

export interface AggregateOperationSupport {
  [model: string]: {
    count?: boolean;
    min?: boolean;
    max?: boolean;
    sum?: boolean;
    avg?: boolean;
  };
}

export type RootType = Array<string>;
