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

import { isDate, isFunction, isSet, isString } from "@stryke/type-checks";
import type { CookieSerializeOptions } from "./types";

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
export function stringifyCookie(
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
