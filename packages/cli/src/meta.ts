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
import { colors } from "consola/utils";
import { text } from "figlet";
import { link } from "./link";
import type { CommandMeta, CommandMetaTitle } from "./types";

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
    "license" | "licenseUrl" | "homepageUrl" | "documentationUrl"
  >
): string {
  const lines = [] as string[];

  if (meta.license) {
    lines.push(" ");
    lines.push(
      `This software is distributed under the ${meta.license} license.`
    );
    if (meta.licenseUrl || meta.homepageUrl || meta.documentationUrl) {
      lines.push(
        `For more information, please visit ${link((meta.licenseUrl || meta.homepageUrl || meta.documentationUrl)!)}`
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
  meta: Pick<
    CommandMeta,
    "homepageUrl" | "repositoryUrl" | "documentationUrl" | "contactUrl"
  >
): string {
  const lines = [] as string[];

  if (meta.homepageUrl) {
    lines.push(`${colors.bold("Website:")}         ${link(meta.homepageUrl)}`);
  }
  if (meta.repositoryUrl) {
    lines.push(
      `${colors.bold("Repository:")}      ${link(meta.repositoryUrl)}`
    );
  }
  if (meta.documentationUrl) {
    lines.push(
      `${colors.bold("Documentation:")}   ${link(meta.documentationUrl)}`
    );
  }
  if (meta.contactUrl) {
    lines.push(`${colors.bold("Contact:")}         ${link(meta.contactUrl)}`);
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
    | "license"
    | "licenseUrl"
    | "homepageUrl"
    | "repositoryUrl"
    | "documentationUrl"
    | "contactUrl"
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
