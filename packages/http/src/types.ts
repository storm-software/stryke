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

/**
 * Cookie serialization options
 */
export interface CookieSerializeOptions {
  /**
   * Specifies the value for the {@link https://tools.ietf.org/html/rfc6265#section-5.2.3 | Domain Set-Cookie attribute}. By default, no
   * domain is set, and most clients will consider the cookie to apply to only
   * the current domain.
   */
  domain?: string | undefined;

  /**
   * Specifies a function that will be used to encode a cookie's value. Since
   * value of a cookie has a limited character set (and must be a simple
   * string), this function can be used to encode a value into a string suited
   * for a cookie's value.
   *
   * The default function is the global `encodeURIComponent`, which will
   * encode a JavaScript string into UTF-8 byte sequences and then URL-encode
   * any that fall outside of the cookie range.
   */
  encode?: (value: string) => string;

  /**
   * Specifies the `Date` object to be the value for the {@link https://tools.ietf.org/html/rfc6265#section-5.2.1 | `Expires` `Set-Cookie` attribute}. By default,
   * no expiration is set, and most clients will consider this a "non-persistent cookie" and will delete
   * it on a condition like exiting a web browser application.
   *
   * Note* the {@link https://tools.ietf.org/html/rfc6265#section-5.3 | cookie storage model specification}
   * states that if both `expires` and `maxAge` are set, then `maxAge` takes precedence, but it is
   * possible not all clients by obey this, so if both are set, they should
   * point to the same date and time.
   */
  expires?: Date | undefined;
  /**
   * Specifies the boolean value for the {@link https://tools.ietf.org/html/rfc6265#section-5.2.6 | `HttpOnly` `Set-Cookie` attribute}.
   * When truthy, the `HttpOnly` attribute is set, otherwise it is not. By
   * default, the `HttpOnly` attribute is not set.
   *
   * Note* be careful when setting this to true, as compliant clients will
   * not allow client-side JavaScript to see the cookie in `document.cookie`.
   */
  httpOnly?: boolean | undefined;
  /**
   * Specifies the number (in seconds) to be the value for the `Max-Age`
   * `Set-Cookie` attribute. The given number will be converted to an integer
   * by rounding down. By default, no maximum age is set.
   *
   * Note* the {@link https://tools.ietf.org/html/rfc6265#section-5.3 | cookie storage model specification}
   * states that if both `expires` and `maxAge` are set, then `maxAge` takes precedence, but it is
   * possible not all clients by obey this, so if both are set, they should
   * point to the same date and time.
   */
  maxAge?: number | undefined;
  /**
   * Specifies the value for the {@link https://tools.ietf.org/html/rfc6265#section-5.2.4|`Path` `Set-Cookie` attribute}.
   * By default, the path is considered the "default path".
   */
  path?: string | undefined;
  /**
   * Specifies the `string` to be the value for the [`Priority` `Set-Cookie` attribute][rfc-west-cookie-priority-00-4.1].
   *
   * - `'low'` will set the `Priority` attribute to `Low`.
   * - `'medium'` will set the `Priority` attribute to `Medium`, the default priority when not set.
   * - `'high'` will set the `Priority` attribute to `High`.
   *
   * More information about the different priority levels can be found in
   * [the specification][rfc-west-cookie-priority-00-4.1].
   *
   * **note** This is an attribute that has not yet been fully standardized, and may change in the future.
   * This also means many clients may ignore this attribute until they understand it.
   */
  priority?: "low" | "medium" | "high" | undefined;
  /**
   * Specifies the boolean or string to be the value for the {@link https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-03#section-4.1.2.7|`SameSite` `Set-Cookie` attribute}.
   *
   * - `true` will set the `SameSite` attribute to `Strict` for strict same
   * site enforcement.
   * - `false` will not set the `SameSite` attribute.
   * - `'lax'` will set the `SameSite` attribute to Lax for lax same site
   * enforcement.
   * - `'strict'` will set the `SameSite` attribute to Strict for strict same
   * site enforcement.
   *  - `'none'` will set the SameSite attribute to None for an explicit
   *  cross-site cookie.
   *
   * More information about the different enforcement levels can be found in {@link https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-03#section-4.1.2.7|the specification}.
   *
   * note* This is an attribute that has not yet been fully standardized, and may change in the future. This also means many clients may ignore this attribute until they understand it.
   */
  sameSite?: true | false | "lax" | "strict" | "none" | undefined;
  /**
   * Specifies the boolean value for the {@link https://tools.ietf.org/html/rfc6265#section-5.2.5 | `Secure` `Set-Cookie` attribute}. When truthy, the
   * `Secure` attribute is set, otherwise it is not. By default, the `Secure` attribute is not set.
   *
   * Note* be careful when setting this to `true`, as compliant clients will
   * not send the cookie back to the server in the future if the browser does
   * not have an HTTPS connection.
   */
  secure?: boolean | undefined;
  /**
   * Specifies the `boolean` value for the [`Partitioned` `Set-Cookie`](https://datatracker.ietf.org/doc/html/draft-cutler-httpbis-partitioned-cookies#section-2.1)
   * attribute. When truthy, the `Partitioned` attribute is set, otherwise it is not. By default, the
   * `Partitioned` attribute is not set.
   *
   * **note** This is an attribute that has not yet been fully standardized, and may change in the future.
   * This also means many clients may ignore this attribute until they understand it.
   *
   * More information can be found in the [proposal](https://github.com/privacycg/CHIPS).
   */
  partitioned?: boolean;
}

/**
 * Additional parsing options
 */
export interface CookieParseOptions {
  /**
   * Specifies a function that will be used to decode a cookie's value. Since
   * the value of a cookie has a limited character set (and must be a simple
   * string), this function can be used to decode a previously-encoded cookie
   * value into a JavaScript string or other object.
   *
   * The default function is the global `decodeURIComponent`, which will decode
   * any URL-encoded sequences into their byte representations.
   *
   * Note* if an error is thrown from this function, the original, non-decoded
   * cookie value will be returned as the cookie's value.
   */
  decode?: (value: string) => string;
  /**
   * Custom function to filter parsing specific keys.
   */
  filter?: (key: string) => boolean;
}

export interface SetCookieParseOptions {
  /**
   * Custom decode function to use on cookie values.
   *
   * By default, `decodeURIComponent` is used.
   *
   * **Note:** If decoding fails, the original (undecoded) value will be used
   */
  decode?: false | ((value: string) => string);
}

export interface SetCookie {
  /**
   * Cookie name
   */
  name: string;

  /**
   * Cookie value
   */
  value: string;

  /**
   * Cookie path
   */
  path?: string | undefined;

  /**
   * Absolute expiration date for the cookie
   */
  expires?: Date | undefined;

  /**
   * Relative max age of the cookie in seconds from when the client receives it (integer or undefined)
   *
   * Note: when using with express's res.cookie() method, multiply maxAge by 1000 to convert to milliseconds
   */
  maxAge?: number | undefined;

  /**
   * Domain for the cookie,
   * May begin with "." to indicate the named domain or any subdomain of it
   */
  domain?: string | undefined;

  /**
   * Indicates that this cookie should only be sent over HTTPs
   */
  secure?: boolean | undefined;

  /**
   * Indicates that this cookie should not be accessible to client-side JavaScript
   */
  httpOnly?: boolean | undefined;

  /**
   * Indicates a cookie ought not to be sent along with cross-site requests
   */
  sameSite?: true | false | "lax" | "strict" | "none" | undefined;

  [key: string]: unknown;
}
