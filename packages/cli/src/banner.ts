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

/**
 * Write a banner to the console.
 *
 * @param banner - The banner to write.
 * @param author - The author of the banner.
 */
export function writeBanner(
  banner: CommandMetaTitle,
  author?: CommandMetaTitle
) {
  const lines = [] as string[];
  if (
    banner.hidden !== true &&
    Boolean(process.env.STORM_SKIP_BANNER) !== true
  ) {
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

    if (author && author?.hidden !== true) {
      text(
        `author ${titleCase(author.name ?? "Storm")}`,
        author?.options ?? { font: author.font ?? "Doom" },
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
