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

import chalk from "chalk";
import terminalLink from "terminal-link";

/**
 * Create a link to a URL in the terminal.
 *
 * @param url - The URL to link to.
 * @returns A terminal link
 */
export function link(url: string): string {
  return terminalLink(url, url, {
    fallback: url => chalk.underline(url)
  });
}
