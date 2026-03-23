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

import type { DMMF } from "@prisma/generator-helper";
import type { ArrayValues } from "@stryke/types/array";
import type { Writeable } from "../types";

export function changeOptionalToRequiredFields(
  inputObjectTypes: Writeable<DMMF.InputType[]>
) {
  inputObjectTypes.map((item: Writeable<DMMF.InputType>) => {
    if (
      item.name.includes("WhereUniqueInput") &&
      // eslint-disable-next-line ts/no-non-null-asserted-optional-chain
      item.constraints.fields?.length! > 0
    ) {
      item.fields = item.fields.map(
        (subItem: Writeable<ArrayValues<DMMF.InputType["fields"]>>) => {
          if (item.constraints.fields?.includes(subItem.name)) {
            subItem.isRequired = true;
            return subItem;
          }
          return subItem;
        }
      );
    }
    return item;
  });
}
