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

import * as z from "zod";

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
  withSoftDelete: configBoolean.default("false"),
  omitUserResources: configBoolean.default("false")
});

export type Config = z.infer<typeof configSchema>;
