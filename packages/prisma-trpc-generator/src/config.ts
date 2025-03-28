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

import { DMMF } from "@prisma/generator-helper";
import { z } from "zod";

const configBoolean = z
  .enum(["true", "false"])
  .transform(arg => JSON.parse(arg));

const configMiddleware = z.union([
  configBoolean,
  z.string().default("../../../../src/middleware")
]);

const configShield = z.union([
  configBoolean,
  z.string().default("../../../../src/shield")
]);

const modelActionEnum = z.nativeEnum(DMMF.ModelAction);

export const configSchema = z.object({
  withMiddleware: configMiddleware.default("true"),
  withShield: configShield.default("true"),
  withZod: configBoolean.default("true"),
  contextPath: z.string().default("../../../../src/context"),
  trpcOptionsPath: z.string().optional(),
  showModelNameInProcedure: configBoolean.default("true"),
  generateModelActions: z
    .string()
    .default(Object.values(DMMF.ModelAction).join(","))
    .transform(arg => {
      return arg.split(",").map(action => modelActionEnum.parse(action.trim()));
    })
});

export type Config = z.infer<typeof configSchema>;
