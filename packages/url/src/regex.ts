/* -------------------------------------------------------------------

                       🗲 Storm Software - Stryke

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

import { VALID_PROTOCOLS, VALID_TLDS } from "./constants";

/**
 * A regex source string that matches any of the valid TLDs (case-insensitive).
 */
export const VALID_TLD_PATTERN = `(?:${[...new Set(VALID_TLDS)].sort((a, b) => b.length - a.length).join("|")})`;

/**
 * A regex source string that matches any of the valid protocols (case-insensitive).
 */
export const VALID_PROTOCOL_PATTERN = `(?:${[...new Set(VALID_PROTOCOLS)].sort((a, b) => b.length - a.length).join("|")})`;

/**
 * A regex that matches valid URLs, including various protocols, domain names, IP addresses, ports, and paths. The regex is case-insensitive and supports a wide range of URL formats. It also includes support for internationalized domain names (IDNs) and various protocols.
 *
 * @see {@link https://tools.ietf.org/html/rfc3986}
 */
export const VALID_URL_REGEX = new RegExp(
  `^(?:${VALID_PROTOCOL_PATTERN}):(?:\\/\\/)?(?:\\S+@)?(?:localhost|(?:\\d{1,3}\\.){3}\\d{1,3}|\\[[a-f0-9:]+\\]|(?:(?:[a-z0-9\\u00A1-\\uFFFF][\\w\\u00A1-\\uFFFF-]{0,62})?[a-z0-9\\u00A1-\\uFFFF]\\.)+${VALID_TLD_PATTERN}\\.?)(?::\\d{2,5})?(?:[\\/?#]\\S*)?$`,
  "i"
);

/**
 * A regex that matches valid GitHub repository references, including optional branches.
 *
 * @remarks
 * A GitHub repository reference string, starting with either `"github:"` or `"gh:"`, an optional branch or tag, and optionally including a specific file path within the repository (for example: `"github:main:storm-software/power-plant/packages/base/resolve/src/types.ts"`). It is also valid to provide the branch or tag after the file path (for example: `"github:storm-software/power-plant/packages/base/resolve/src/types.ts@main"`).
 */
export const VALID_GITHUB_REPO_REFERENCE_REGEX =
  /^(?:github|gh):(?:[^\s/:@]+:)?[^\s/:@]+\/[^\s/:@]+(?:\/[^\s:@]+)?(?:@[^\s/:@]+)?$/i;

/**
 * A regex that matches valid GitLab repository references, including optional branches.
 *
 * @remarks
 * A GitLab repository reference string, starting with either `"gitlab:"` or `"gl:"`, an optional branch or tag, and optionally including a specific file path within the repository (for example: `"gitlab:master:storm-software/power-plant/packages/base/resolve/src/types.ts"`). It is also valid to provide the branch or tag after the file path (for example: `"gitlab:storm-software/power-plant/packages/base/resolve/src/types.ts@master"`).
 */
export const VALID_GITLAB_REPO_REFERENCE_REGEX =
  /^(?:gitlab|gl):(?:[^\s/:@]+:)?[^\s/:@]+\/[^\s/:@]+(?:\/[^\s:@]+)?(?:@[^\s/:@]+)?$/i;
