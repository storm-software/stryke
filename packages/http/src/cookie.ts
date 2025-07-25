/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/projects/stryke/license.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://docs.stormsoftware.com/projects/stryke
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import { isDate, isFunction, isSet, isString } from "@stryke/type-checks";
import type {
  CookieParseOptions,
  CookieSerializeOptions,
  SetCookie,
  SetCookieParseOptions
} from "./types";

/**
 * Parse an HTTP Cookie header string and returning an object of all cookie
 * name-value pairs.
 *
 * @param strCookie - the string representing a `Cookie` header value
 * @param options - object containing parsing options
 * @returns an object with the parsed cookies
 */
export function parseCookie(
  strCookie: string,
  options?: CookieParseOptions
): Record<string, string> {
  if (!isString(strCookie)) {
    throw new Error("argument str must be a string");
  }

  const obj = {};
  const opt = options ?? {};
  const dec =
    opt.decode ??
    ((str: string) => (str.includes("%") ? decodeURIComponent(str) : str));

  let index = 0;
  while (index < strCookie.length) {
    const eqIdx = strCookie.indexOf("=", index);

    // no more cookie pairs
    if (eqIdx === -1) {
      break;
    }

    let endIdx = strCookie.indexOf(";", index);

    if (endIdx === -1) {
      endIdx = strCookie.length;
    } else if (endIdx < eqIdx) {
      // backtrack on prior semicolon
      index = strCookie.lastIndexOf(";", eqIdx - 1) + 1;

      continue;
    }

    const key = strCookie.slice(index, eqIdx).trim();
    if (opt?.filter && !opt?.filter(key)) {
      index = endIdx + 1;

      continue;
    }

    // only assign once
    if (undefined === obj[key as keyof typeof obj]) {
      let val = strCookie.slice(eqIdx + 1, endIdx).trim();

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
    // Fallback to undecoded value
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

/**
 * RegExp to match field-content in RFC 7230 sec 3.2
 *
 * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 * field-vchar   = VCHAR / obs-text
 * obs-text      = %x80-FF
 */

const fieldContentRegExp = /^[\t\u0020-\u007E\u0080-\u00FF]+$/;

/**
 * Serialize a cookie name-value pair into a `Set-Cookie` header string.
 *
 * @param name - the name for the cookie
 * @param value - value to set the cookie to
 * @param options - object containing serialization options
 * @returns a `Set-Cookie` header string
 */
export function serializeCookie(
  name: string,
  value: string,
  options?: CookieSerializeOptions
): string {
  const opt = options ?? {};
  const enc = opt.encode ?? encodeURIComponent;

  if (!isFunction(enc)) {
    throw new Error("option encode is invalid");
  }

  if (!fieldContentRegExp.test(name)) {
    throw new Error("argument name is invalid");
  }

  const encodedValue = enc(value);

  if (encodedValue && !fieldContentRegExp.test(encodedValue)) {
    throw new Error("argument val is invalid");
  }

  let str = `${name}=${encodedValue}`;

  if (!isSet(opt.maxAge)) {
    const maxAge = Number(opt.maxAge);

    if (Number.isNaN(maxAge) || !Number.isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }

    str += `; Max-Age=${Math.floor(maxAge)}`;
  }

  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new Error("option domain is invalid");
    }

    str += `; Domain=${opt.domain}`;
  }

  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new Error("option path is invalid");
    }

    str += `; Path=${opt.path}`;
  }

  if (opt.expires) {
    if (!isDate(opt.expires) || Number.isNaN(opt.expires.valueOf())) {
      throw new Error("option expires is invalid");
    }

    str += `; Expires=${opt.expires.toUTCString()}`;
  }

  if (opt.httpOnly) {
    str += "; HttpOnly";
  }

  if (opt.secure) {
    str += "; Secure";
  }

  if (opt.priority) {
    const priority = isString(opt.priority)
      ? opt.priority.toLowerCase()
      : opt.priority;

    switch (priority) {
      case "low": {
        str += "; Priority=Low";
        break;
      }
      case "medium": {
        str += "; Priority=Medium";
        break;
      }
      case "high": {
        str += "; Priority=High";
        break;
      }
      default: {
        throw new Error("option priority is invalid");
      }
    }
  }

  if (opt.sameSite) {
    const sameSite = isString(opt.sameSite)
      ? opt.sameSite.toLowerCase()
      : opt.sameSite;

    switch (sameSite) {
      case true: {
        str += "; SameSite=Strict";
        break;
      }
      case "lax": {
        str += "; SameSite=Lax";
        break;
      }
      case "strict": {
        str += "; SameSite=Strict";
        break;
      }
      case "none": {
        str += "; SameSite=None";
        break;
      }
      default: {
        throw new Error("option sameSite is invalid");
      }
    }
  }

  if (opt.partitioned) {
    str += "; Partitioned";
  }

  return str;
}

/**
 * Set-Cookie header field-values are sometimes comma joined in one string. This splits them without choking on commas
 * that are within a single set-cookie field-value, such as in the Expires portion.
 *
 * See https://tools.ietf.org/html/rfc2616#section-4.2
 *
 * @param strCookie - The string representing a `Set-Cookie` header value
 * @returns An array of strings representing individual `Set-Cookie` header values
 */
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
