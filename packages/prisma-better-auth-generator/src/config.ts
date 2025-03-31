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
  withTRPC: configBoolean.default("true")
});

export type Config = z.infer<typeof configSchema>;
