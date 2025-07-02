/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/license.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://docs.stormsoftware.com/projects/stryke
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import { titleCase } from "@stryke/string-format/title-case";
import { text } from "figlet";
import type { CommandMeta, CommandMetaTitle } from "./types";
import { colors } from "./utils/color";
import { link } from "./utils/link";

/**
 * Write a banner to the console.
 *
 * @param banner - The banner to write.
 * @param author - The author of the banner.
 */
export function renderBanner(
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
  }

  return lines.join("\n");
}

/**
 * Get the license information for a command.
 *
 * @param meta - The command metadata.
 * @returns The license information display string
 */
export function renderLicense(
  meta: Pick<
    CommandMeta,
    "author" | "license" | "licensing" | "homepage" | "docs" | "contact"
  >
): string {
  const lines = [] as string[];

  if (meta.license) {
    lines.push(" ");
    lines.push(
      `This software is distributed${meta.author?.name ? ` by ${meta.author.name}` : ""} under the ${meta.license} license.`
    );
    if (meta.licensing || meta.homepage || meta.docs) {
      lines.push(
        `For more information, please visit ${link((meta.licensing || meta.homepage || meta.docs)!)}${meta.contact ? ` or contact us at ${link(meta.contact)} with any inquiries` : ""}.`
      );
    }
  }

  return lines.join("\n");
}

/**
 * Write URLs to the console.
 *
 * @param meta - The metadata to write.
 * @returns The URLs as a display string
 */
export function renderUrls(
  meta: Pick<CommandMeta, "homepage" | "repository" | "docs" | "contact">
): string {
  const lines = [] as string[];

  if (meta.homepage) {
    lines.push(`${colors.bold("Website:")}         ${link(meta.homepage)}`);
  }
  if (meta.repository) {
    lines.push(`${colors.bold("Repository:")}      ${link(meta.repository)}`);
  }
  if (meta.docs) {
    lines.push(`${colors.bold("Documentation:")}   ${link(meta.docs)}`);
  }
  if (meta.contact) {
    lines.push(`${colors.bold("Contact:")}         ${link(meta.contact)}`);
  }

  return lines.join("\n");
}

/**
 * Write metadata to the console.
 *
 * @param meta - The metadata to write.
 * @returns The metadata as a display string
 */
export function renderMeta(
  meta: Pick<
    CommandMeta,
    | "author"
    | "license"
    | "licensing"
    | "homepage"
    | "repository"
    | "docs"
    | "contact"
  >
): string {
  let display = renderUrls(meta);
  if (meta.license) {
    if (display.trim()) {
      display += "\n";
    }

    display += renderLicense(meta);
  }

  return display;
}
