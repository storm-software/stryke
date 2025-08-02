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

import { z } from "zod";

export enum ModelAction {
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

const configBoolean = z
  .string()
  .trim()
  .transform(value =>
    !value ||
    value.toLowerCase() === "false" ||
    value.toLowerCase() === "n" ||
    value.toLowerCase() === "no" ||
    value === "0"
      ? false
      : value.toLowerCase() === "true" ||
          value.toLowerCase() === "y" ||
          value.toLowerCase() === "yes" ||
          value === "1"
        ? true
        : value
  );

export const configSchema = z.object({
  debug: configBoolean.default("false"),
  withNext: configBoolean.default("true"),
  withMiddleware: configBoolean.default("false"),
  withShield: configBoolean.default("false"),
  contextPath: z.string().trim().default("../context"),
  trpcOptions: configBoolean.default("true"),
  showModelNameInProcedure: configBoolean.default("false"),
  generateModelActions: z
    .string()
    .default(Object.values(ModelAction).join(","))
    .transform(arg => {
      return arg.split(",").map(action => modelActionEnum.parse(action.trim()));
    }),

  // Zod configuration
  withZod: configBoolean.default("true"),
  relationModel: configBoolean.default("true").or(z.literal("default")),
  modelSuffix: z.string().default("Schema"),
  modelCase: z.enum(["PascalCase", "camelCase"]).default("camelCase"),
  useDecimalJs: configBoolean.default("true"),
  imports: z.string().optional(),
  prismaJsonNullability: configBoolean.default("true")
});

export type Config = z.infer<typeof configSchema>;
