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

import terminalLink from "terminal-link";
import { colors } from "./color";

/**
 * Create a link to a URL in the terminal.
 *
 * @param url - The URL to link to.
 * @param isColored - Whether to use cyan text for the link.
 * @returns A terminal link
 */
export function link(url: string, isColored = true): string {
  return terminalLink(url, url, {
    fallback: url => colors.underline(isColored ? colors.cyan(url) : url)
  });
}
