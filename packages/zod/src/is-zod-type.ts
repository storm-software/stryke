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

import type * as z3 from "zod/v3";
import type * as z4 from "zod/v4/core";

import { isSetObject } from "@stryke/type-checks/is-set-object";
import type { ZodType } from "./types";

/**
 * Type guard to check if a given value is a Zod schema of version 3.
 *
 * @param type - The value to check.
 * @returns True if the value is a Zod schema, false otherwise.
 */
export function isZod3Type(type: unknown): type is z3.ZodTypeAny {
  return (
    isSetObject(type) &&
    "_def" in type &&
    "typeName" in (type as z3.ZodTypeAny)._def
  );
}

/**
 * Type guard to check if a given value is a Zod schema of version 4.
 *
 * @param type - The value to check.
 * @returns True if the value is a Zod v4 schema, false otherwise.
 */
export function isZod4Type(type: unknown): type is z4.$ZodType {
  return (
    isSetObject(type) && "_zod" in type && "def" in (type as z4.$ZodType)._zod
  );
}

/**
 * Type guard to check if a given value is a Zod schema of either version 3 or 4.
 *
 * @param type - The value to check.
 * @returns True if the value is a Zod schema, false otherwise.
 */
export function isZodType(type: unknown): type is ZodType {
  return isZod3Type(type) || isZod4Type(type);
}
