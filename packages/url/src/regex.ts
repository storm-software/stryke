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

import { URL_PROTOCOLS, URL_TOP_LEVEL_DOMAINS } from "./constants";

/**
 * A regex source string that matches any of the valid TLDs (case-insensitive).
 */
export const VALID_TLD_PATTERN = `(?:${[...new Set(URL_TOP_LEVEL_DOMAINS)].sort((a, b) => b.length - a.length).join("|")})`;

/**
 * A regex source string that matches any of the valid protocols (case-insensitive).
 */
export const VALID_PROTOCOL_PATTERN = `(?:${[...new Set(URL_PROTOCOLS)].sort((a, b) => b.length - a.length).join("|")})`;

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
 * A regex source string that matches any of the protocols supported by the `URLProtocol` type (case-insensitive). Longer protocols are listed first to avoid partial matches.
 */
export const URL_PROTOCOL_REGEX =
  "(?:https|http|ftps|ftp|wss|ws|file|data|blob|mailto|tel|urn|sips|sip|sms|nfs|ssh|git|svn|rsync|rtsp|rtmp|mms)";

/**
 * A regex that matches valid URL string references.
 *
 * @remarks
 * A {@link URLString} is one of the following shapes: a protocol followed by `://` and the remainder of the URL (for example: `"https://example.com"`), a protocol-relative reference starting with `//` (for example: `"//example.com"`), or a protocol followed by an opaque value (for example: `"mailto:hello@example.com"`).
 */
export const URL_STRING_REGEX = new RegExp(
  `^(?:\\/\\/\\S+|${URL_PROTOCOL_REGEX}:\\S*)$`,
  "i"
);
