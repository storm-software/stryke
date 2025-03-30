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

const configBoolean = z
  .enum(["true", "false"])
  .transform(arg => JSON.parse(arg));

const configMiddleware = z.union([
  configBoolean,
  z.string().default("../src/trpc/middleware")
]);

const configShield = z.union([
  configBoolean,
  z.string().default("../src/trpc/shields")
]);

const modelActionEnum = z.nativeEnum(ModelAction);

export const configSchema = z.object({
  debug: configBoolean.default("false"),
  withMiddleware: configMiddleware.default("false"),
  withShields: configShield.default("true"),
  withZod: configBoolean.default("true"),
  withNext: configBoolean.default("true"),
  contextPath: z.string().default("../src/trpc/context"),
  trpcOptions: z.boolean().or(z.string()).optional(),
  showModelNameInProcedure: configBoolean.default("true"),
  generateModelActions: z
    .string()
    .default(Object.values(ModelAction).join(","))
    .transform(arg => {
      return arg.split(",").map(action => modelActionEnum.parse(action.trim()));
    })
});

export type Config = z.infer<typeof configSchema>;
