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
import { lowerCaseFirst } from "@stryke/string-format/lower-case-first";
import type { SourceFile } from "ts-morph";

export async function generateAccessControl(
  sourceFile: SourceFile,
  modelOperations: DMMF.ModelMapping[]
) {
  sourceFile.addStatements(/* ts */ `import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultStatements,
} from "better-auth/plugins/admin/access";`);

  sourceFile.addStatements(/* ts */ `
export const statements = {
  ...defaultStatements,
${modelOperations
  .map(modelOperation => {
    const { model, plural: _, ...operations } = modelOperation;

    return `${lowerCaseFirst(model)}: [${Object.keys(operations)
      .filter(
        operation =>
          !operation.endsWith("ManyAndReturn") && !operation.endsWith("OrThrow")
      )
      .map(operation => `"${operation.replace("One", "")}"`)
      .join(", ")}]`;
  })
  .join(",\n")}
}`);

  sourceFile.addStatements(/* ts */ `
export const ac = createAccessControl(statements);`);

  sourceFile.formatText({
    indentSize: 2
  });
}
