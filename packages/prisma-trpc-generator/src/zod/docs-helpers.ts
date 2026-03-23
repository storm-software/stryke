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

import type { ArrayTree } from "parenthesis";
import parenthesis from "parenthesis";
import { chunk } from "./model-helpers";

export const getJSDocs = (docString?: string) => {
  const lines: string[] = [];

  if (docString) {
    const docLines = docString
      .split("\n")
      .filter(dL => !dL.trimStart().startsWith("@zod"));

    if (docLines.length) {
      lines.push("/**");
      docLines.forEach(dL => lines.push(` * ${dL}`));
      lines.push(" */");
    }
  }

  return lines;
};

export const getZodDocElements = (docString: string) =>
  docString
    .split("\n")
    .filter(line => line.trimStart().startsWith("@zod"))
    .map(line => line.trimStart().slice(4))
    .flatMap(line =>
      // Array.from(line.matchAll(/\.([^().]+\(.*?\))/g), (m) => m.slice(1)).flat()
      chunk(parenthesis.parse(line), 2)
        .slice(0, -1)
        .map(
          ([each, contents]) =>
            `${(each as string).replace(
              /\)?\./,
              ""
            )}${parenthesis.stringify(contents as ArrayTree)})`
        )
    );
