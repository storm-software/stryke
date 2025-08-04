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

export interface StormURLOptions {
  /**
   * Should the URL be decoded
   *
   * @defaultValue `true`
   */
  decode?: boolean;

  /**
   * Should the URL include a locale path segment
   */
  locale?: string | true;

  /**
   * The default protocol to use
   *
   * @defaultValue "https"
   */
  defaultProtocol?: string;
}

export const PROTOCOL_RELATIVE_SYMBOL: unique symbol =
  Symbol("protocol-relative");

export interface StormURLInterface extends URL {
  /**
   * A string containing the username and password specified before the domain name.
   */
  auth: string;

  /**
   * A string containing the username specified before the domain name.
   */
  username: string;

  /**
   * A string containing the password specified before the domain name.
   */
  password: string;

  /**
   * A string containing the domain (that is the hostname) followed by (if a port was specified) a `:` and the port of the URL.
   */
  host: string;

  /**
   * A string containing the domain of the URL.
   */
  hostname: string;

  /**
   * A string containing the port number of the URL.
   */
  port: string;

  /**
   * A string containing the protocol scheme of the URL, including the final `:`.
   */
  protocol: string;

  /**
   * A stringified value that returns the whole URL.
   */
  href: string;

  /**
   * A string containing an initial `/` followed by the path of the URL, not including the query string or fragment.
   */
  pathname: string;

  /**
   * The paths of the URL
   */
  paths: any[];

  /**
   * A string containing a `#` followed by the fragment identifier of the URL.
   */
  hash: string;

  /**
   * A string indicating the URL's parameter string; if any parameters are provided, this string includes all of them, beginning with the leading `?` character.
   */
  search: string;

  /**
   * The search parameters of the URL
   *
   * @remarks
   * This is a `URLSearchParams` object that contains the search parameters of the URL.
   */
  searchParams: URLSearchParams;

  /**
   * The search parameters of the URL
   *
   * @remarks
   * This is a Record\<string, any\> object that contains the search parameters of the URL.
   */
  params: Record<string, any>;

  /**
   * An optional symbol to indicate that the URL is protocol-relative
   *
   * @remarks
   * This is used when the URL is protocol-relative (e.g. //example.com)
   */
  [PROTOCOL_RELATIVE_SYMBOL]?: boolean;
}
