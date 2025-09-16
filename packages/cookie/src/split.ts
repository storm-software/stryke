/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

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

import { isString } from "@stryke/type-checks/is-string";

/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

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

export function splitSetCookieString(strCookie: string | string[]): string[] {
  if (Array.isArray(strCookie)) {
    return strCookie.flatMap(c => splitSetCookieString(c));
  }

  if (!isString(strCookie)) {
    return [];
  }

  const cookiesStrings: string[] = [];
  let pos: number = 0;
  let start: number;
  let ch: string;
  let lastComma: number;
  let nextStart: number;
  let cookiesSeparatorFound: boolean;

  const skipWhitespace = () => {
    while (pos < strCookie.length && /\s/.test(strCookie.charAt(pos))) {
      pos += 1;
    }
    return pos < strCookie.length;
  };

  const notSpecialChar = () => {
    ch = strCookie.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };

  while (pos < strCookie.length) {
    start = pos;
    cookiesSeparatorFound = false;

    while (skipWhitespace()) {
      ch = strCookie.charAt(pos);
      if (ch === ",") {
        // ',' is a cookie separator if we have later first '=', not ';' or ','
        lastComma = pos;
        pos += 1;

        skipWhitespace();
        nextStart = pos;

        while (pos < strCookie.length && notSpecialChar()) {
          pos += 1;
        }

        // currently special character
        if (pos < strCookie.length && strCookie.charAt(pos) === "=") {
          // we found cookies separator
          cookiesSeparatorFound = true;
          // pos is inside the next cookie, so back up and return it.
          pos = nextStart;
          cookiesStrings.push(strCookie.slice(start, lastComma));
          start = pos;
        } else {
          // in param ',' or param separator ';',
          // we continue from that comma
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }

    if (!cookiesSeparatorFound || pos >= strCookie.length) {
      cookiesStrings.push(strCookie.slice(start));
    }
  }

  return cookiesStrings;
}
