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

import { titleCase } from "@stryke/string-format/title-case";
import { consola } from "consola";
import { colors } from "consola/utils";
import { text } from "figlet";
import type { CommandMetaTitle } from "./types";

export function writeBanner(banner: CommandMetaTitle, by?: CommandMetaTitle) {
  const lines = [] as string[];
  if (banner.hidden !== true) {
    text(
      titleCase(banner.name ?? "Storm CLI"),
      banner.options ?? {
        font: banner.font ?? "Larry 3D"
      },
      (err, data) => {
        if (err) {
          return;
        }

        if (data) {
          lines.push(colors.whiteBright(data));
        }
      }
    );

    if (by && by?.hidden !== true) {
      text(
        `by ${titleCase(by.name ?? "Storm")}`,
        by?.options ?? { font: by.font ?? "Doom" },
        (err, data) => {
          if (err) {
            return;
          }

          if (data) {
            lines.push(colors.white(data));
          }
        }
      );
    }

    if (lines.length > 0) {
      consola.box(lines.join("\n"));
    }
  }
}
