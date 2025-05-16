/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/projects/stryke/license.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://stormsoftware.com/projects/stryke/docs
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import { StormJSON } from "@stryke/json/storm-json";
import { joinPaths } from "@stryke/path/join-paths";
import { isInteger } from "@stryke/type-checks/is-integer";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { isUndefined } from "@stryke/type-checks/is-undefined";
import type { ParsedURL } from "ufo";
import {
  cleanDoubleSlashes,
  decode as decodeURL,
  isEqual,
  isNonEmptyURL,
  isRelative,
  isSamePath,
  isScriptProtocol,
  normalizeURL,
  parseAuth,
  parseHost,
  parsePath,
  parseQuery,
  parseURL,
  stringifyParsedURL,
  stringifyQuery
} from "ufo";
import { formatLocalePath } from "./helpers";
import type { IStormURL, StormURLOptions } from "./types";

/**
 * A class used to build URLs
 *
 * @remarks
 * This class is used to build URLs with a fluent API.
 *
 * The [UFO](https://github.com/unjs/ufo) library is used under the hood to parse and stringify URLs.
 */
export class StormURL implements IStormURL, URL {
  #options: StormURLOptions;

  /**
   * A string containing the username specified before the domain name.
   */
  #username?: string;

  /**
   * A string containing the password specified before the domain name.
   */
  #password?: string;

  /**
   * A string containing the domain of the URL.
   */
  #hostname: string;

  /**
   * A string containing the port number of the URL.
   */
  #port?: string;

  /**
   * A string containing the protocol scheme of the URL, including the final `:`.
   */
  #protocol?: string;

  /**
   * The paths of the URL
   */
  #paths: string[] = [];

  /**
   * A string containing a `#` followed by the fragment identifier of the URL.
   */
  #hash: string;

  /**
   * The search parameters of the URL
   */
  #params: Record<string, any>;

  constructor(initialURL: string, options: StormURLOptions = { decode: true }) {
    this.#options = options;

    const parsedURL = parseURL(
      this.#options.decode ? decodeURL(initialURL) : initialURL
    );

    const parsedAuth = parseAuth(parsedURL.auth);
    this.#username = parsedAuth.username;
    this.#password = parsedAuth.password;

    const parsedHost = parseHost(parsedURL.host);
    this.#hostname = parsedHost.hostname;
    this.#port = parsedHost.port;

    this.#protocol = parsedURL.protocol;
    this.#hash = parsedURL.hash || "";
    this.#params = parseQuery(parsedURL.search);

    this.#paths = parsedURL.pathname
      ? parsedURL.pathname.split("/").filter(Boolean)
      : [];
    if (options.locale) {
      this.#paths.unshift(
        formatLocalePath(
          (isSetString(options.locale)
            ? options.locale
            : process.env.DEFAULT_LOCALE) || "en-us"
        )
      );
    }
  }

  public set params(value: Record<string, any>) {
    this.#params = value;
  }

  public get params(): Record<string, any> {
    return this.#params;
  }

  public get searchParams(): URLSearchParams {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(this.params)) {
      params.append(key, value);
    }
    return params;
  }

  public set searchParams(value: URLSearchParams) {
    this.params = Object.fromEntries(value.entries());
  }

  public set search(value: string) {
    this.params = parseQuery(value);
  }

  public get search(): string {
    const search = stringifyQuery(this.params);

    return search ? (search.startsWith("?") ? search : `?${search}`) : "";
  }

  public set hash(value: string) {
    this.#hash = value.startsWith("#") ? value : `#${value}`;
  }

  public get hash(): string {
    return this.#hash;
  }

  public set port(value: string | number) {
    this.#port = !isUndefined(value) && isInteger(value) ? `${value}` : "";
  }

  public get port(): string {
    return this.#port || "";
  }

  public set username(value: string) {
    this.auth = `${value}:${this.#password}`;
  }

  public get username(): string {
    return this.#username || "";
  }

  public set password(value: string) {
    this.auth = `${this.#username}:${value}`;
  }

  public get password(): string {
    return this.#password || "";
  }

  public set auth(value: string | undefined) {
    const parsedAuth = parseAuth(value);

    this.#username = parsedAuth.username;
    this.#password = parsedAuth.password;
  }

  public get auth(): string {
    return this.#username && this.#password
      ? `${this.#username}:${this.#password}`
      : this.#username
        ? this.#username
        : this.#password
          ? this.#password
          : "";
  }

  public set protocol(value: string) {
    this.#protocol = value.endsWith(":")
      ? value
      : value.endsWith("://")
        ? value.slice(0, -2)
        : `${value}:`;
  }

  public get protocol(): string {
    return this.#protocol || this.#options.defaultProtocol || "https:";
  }

  public set hostname(value: string) {
    this.#hostname = value;
  }

  public get hostname(): string {
    return this.#hostname;
  }

  public set host(value: string | undefined) {
    const parsedHost = parseHost(value);
    this.#hostname = parsedHost.hostname;
    this.#port = parsedHost.port;
  }

  public get host(): string {
    return this.#hostname && this.#port
      ? `${this.#hostname}:${this.#port}`
      : this.#hostname
        ? this.#hostname
        : this.#port
          ? this.#port
          : "";
  }

  public set paths(value: any[]) {
    this.#paths = value.filter(Boolean);
  }

  public get paths(): any[] {
    return this.#paths;
  }

  public set pathname(value: string) {
    this.paths = cleanDoubleSlashes(value).split("/");
  }

  public get pathname(): string {
    return `/${this.paths ? joinPaths(...this.paths.map(path => StormJSON.stringify(path))) : ""}`;
  }

  public set path(value: string) {
    const parsedPath = parsePath(value);
    this.pathname = parsedPath.pathname;
    this.search = parsedPath.search;
    this.#hash = parsedPath.hash;
  }

  public get path(): string {
    return stringifyParsedURL({
      pathname: this.pathname,
      search: this.search,
      hash: this.hash
    });
  }

  public get href(): string {
    return this.toString();
  }

  public set href(value: string) {
    const parsedURL = parseURL(value);
    this.protocol = parsedURL.protocol || this.protocol;
    this.auth = parsedURL.auth || this.auth;
    this.host = parsedURL.host || this.host;
    this.pathname = parsedURL.pathname || this.pathname;
    this.search = parsedURL.search || this.search;
    this.hash = parsedURL.hash || this.hash;
  }

  public get origin(): string {
    return `${this.protocol}//${this.host}`;
  }

  public get isScriptProtocol(): boolean {
    return isScriptProtocol(this.protocol);
  }

  public get isRelative(): boolean {
    return isRelative(this.toString());
  }

  public get isNonEmptyURL(): boolean {
    return isNonEmptyURL(this.toString());
  }

  public get __typename() {
    return "StormURL";
  }

  public isSamePath(path: string): boolean {
    return isSamePath(this.path, path);
  }

  public isEqual(url: string | ParsedURL | StormURL): boolean {
    return isEqual(
      this.toString(),
      typeof url === "string"
        ? url
        : url instanceof StormURL
          ? url.toString()
          : stringifyParsedURL(url)
    );
  }

  public toParsed(): ParsedURL {
    return {
      protocol: this.protocol,
      auth: this.auth,
      host: this.host,
      pathname: this.pathname,
      search: this.search,
      hash: this.hash
    };
  }

  public toString(): string {
    return stringifyParsedURL(this.toParsed());
  }

  public toEncoded(): string {
    return normalizeURL(this.toString());
  }

  public toJSON(): string {
    return StormJSON.stringify(this.toParsed());
  }
}

StormJSON.instance.registerCustom<StormURL, string>(
  {
    isApplicable: (v): v is StormURL => v.__typename === "StormURL",
    serialize: v => v.toEncoded(),
    deserialize: v => new StormURL(v, { decode: true })
  },
  "StormURL"
);
