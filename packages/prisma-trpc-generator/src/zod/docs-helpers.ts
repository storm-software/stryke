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

import type { ArrayTree } from "parenthesis";
import { parse, stringify } from "parenthesis";
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
      chunk(parse(line), 2)
        .slice(0, -1)
        .map(
          ([each, contents]) =>
            `${(each as string).replace(
              /\)?\./,
              ""
            )}${stringify(contents as ArrayTree)})`
        )
    );
