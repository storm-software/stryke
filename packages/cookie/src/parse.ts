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

import { isString } from "@stryke/type-checks";
import type {
  CookieParseOptions,
  SetCookie,
  SetCookieParseOptions
} from "./types";

/**
 * Parse an HTTP Cookie header string and returning an object of all cookie name-value pairs.
 *
 * @param cookie - the string representing a `Cookie` header value
 * @param options - object containing parsing options
 * @returns an object with the parsed cookies
 */
export function parseCookie(
  cookie: string,
  options?: CookieParseOptions
): Record<string, string> {
  if (!isString(cookie)) {
    throw new Error("argument str must be a string");
  }

  const obj = {};
  const opt = options ?? {};
  const dec =
    opt.decode ??
    ((str: string) => (str.includes("%") ? decodeURIComponent(str) : str));

  let index = 0;
  while (index < cookie.length) {
    const eqIdx = cookie.indexOf("=", index);

    // no more cookie pairs
    if (eqIdx === -1) {
      break;
    }

    let endIdx = cookie.indexOf(";", index);

    if (endIdx === -1) {
      endIdx = cookie.length;
    } else if (endIdx < eqIdx) {
      // backtrack on prior semicolon
      index = cookie.lastIndexOf(";", eqIdx - 1) + 1;

      continue;
    }

    const key = cookie.slice(index, eqIdx).trim();
    if (opt?.filter && !opt?.filter(key)) {
      index = endIdx + 1;

      continue;
    }

    // only assign once
    if (undefined === obj[key as keyof typeof obj]) {
      let val = cookie.slice(eqIdx + 1, endIdx).trim();

      // quoted values
      if (val.codePointAt(0) === 0x22) {
        val = val.slice(1, -1);
      }

      try {
        (obj as any)[key] = dec(val);
      } catch {
        (obj as any)[key] = val;
      }
    }

    index = endIdx + 1;
  }

  return obj;
}

/**
 * Parse a [Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie) header string into an object.
 *
 * @param setCookieValue - the string representing a `Set-Cookie` header value
 * @param options - object containing parsing options
 * @returns an object with the parsed cookie
 */
export function parseSetCookie(
  setCookieValue: string,
  options?: SetCookieParseOptions
): SetCookie {
  const parts = (setCookieValue || "")
    .split(";")
    .filter(str => isString(str) && Boolean(str.trim()));

  const nameValuePairStr = parts.shift() || "";

  let name = "";
  let value = "";
  const nameValueArr = nameValuePairStr.split("=");
  if (nameValueArr.length > 1) {
    name = nameValueArr.shift()!;
    // Everything after the first =, joined by a "=" if there was more than one part
    value = nameValueArr.join("=");
  } else {
    value = nameValuePairStr;
  }

  try {
    value =
      options?.decode === false
        ? value
        : (options?.decode ?? decodeURIComponent)(value);
  } catch {
    // Do nothing
  }

  const cookie: SetCookie = {
    name,
    value
  };

  for (const part of parts) {
    const sides = part.split("=");
    const partKey = (sides.shift() || "").trimStart().toLowerCase();
    const partValue = sides.join("=");
    switch (partKey) {
      case "expires": {
        cookie.expires = new Date(partValue);
        break;
      }
      case "max-age": {
        cookie.maxAge = Number.parseInt(partValue, 10);
        break;
      }
      case "secure": {
        cookie.secure = true;
        break;
      }
      case "httponly": {
        cookie.httpOnly = true;
        break;
      }
      case "samesite": {
        cookie.sameSite = partValue as SetCookie["sameSite"];
        break;
      }
      default: {
        cookie[partKey] = partValue;
      }
    }
  }

  return cookie;
}
