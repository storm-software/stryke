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

import { z } from "zod";

enum ModelAction {
  findUnique = "findUnique",
  findUniqueOrThrow = "findUniqueOrThrow",
  findFirst = "findFirst",
  findFirstOrThrow = "findFirstOrThrow",
  findMany = "findMany",
  create = "create",
  createMany = "createMany",
  createManyAndReturn = "createManyAndReturn",
  update = "update",
  updateMany = "updateMany",
  updateManyAndReturn = "updateManyAndReturn",
  upsert = "upsert",
  delete = "delete",
  deleteMany = "deleteMany",
  groupBy = "groupBy",
  count = "count", // TODO: count does not actually exist, why?
  aggregate = "aggregate",
  findRaw = "findRaw",
  aggregateRaw = "aggregateRaw"
}

const modelActionEnum = z.nativeEnum(ModelAction);

export const configSchema = z.object({
  debug: z.coerce.boolean().or(z.string()).default(false),
  withMiddleware: z.coerce.boolean().or(z.string()).default(false),
  withShield: z.coerce.boolean().or(z.string()).default(true),
  withZod: z.coerce.boolean().or(z.string()).default(true),
  withNext: z.coerce.boolean().or(z.string()).default(true),
  contextPath: z.string().default("../src/trpc/context"),
  trpcOptions: z.coerce.boolean().or(z.string()).optional(),
  showModelNameInProcedure: z.coerce.boolean().or(z.string()).default(true),
  generateModelActions: z
    .string()
    .default(Object.values(ModelAction).join(","))
    .transform(arg => {
      return arg.split(",").map(action => modelActionEnum.parse(action.trim()));
    })
});

export type Config = z.infer<typeof configSchema>;
