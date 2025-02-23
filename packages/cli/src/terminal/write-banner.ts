/*-------------------------------------------------------------------

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

 -------------------------------------------------------------------*/

import { titleCase } from "@stryke/string-format/title-case";
import chalk from "chalk";
import { text } from "figlet";
import type { CLITitle } from "../types";

export const writeBanner = (
  bannerOpts: CLITitle,
  byOpts: CLITitle,
  color?: string,
) => {
  if (bannerOpts?.hide !== true) {
    text(
      titleCase(bannerOpts?.name ?? "Storm CLI")!,
      bannerOpts?.options ?? {
        font: bannerOpts?.font ?? "Larry 3D",
      },
      (err, data) => {
        if (err) {
          return;
        }

        // eslint-disable-next-line no-console
        console.log(chalk.hex(color || "#FFF")(data));
      },
    );

    if (byOpts?.hide !== true) {
      text(
        `by ${titleCase(byOpts?.name ?? "Storm")}`,
        byOpts?.options ?? { font: byOpts?.font ?? "Doom" },
        (err, data) => {
          if (err) {
            return;
          }

          // eslint-disable-next-line no-console
          console.log(chalk.hex(color || "#adbac7")(data));
        },
      );
    }
  }
};
