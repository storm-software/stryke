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

import { StormJSON } from "@stryke/json/storm-json";
import { isString } from "@stryke/type-checks/is-string";
import type { ParsedAuth, ParsedHost } from "ufo";
import {
  cleanDoubleSlashes,
  decode as decodeURL,
  encode as encodeURL,
  parseAuth,
  parsePath,
  parseQuery,
  parseURL,
  stringifyParsedURL
} from "ufo";
import type { StormURL } from "./types";

export interface StormURLBuilderOptions {
  /**
   * Should the URL be decoded
   *
   * @defaultValue `true`
   */
  decode: boolean;
}

/**
 * A class used to build URLs
 *
 * @remarks
 * This class is used to build URLs with a fluent API.
 *
 * The [UFO](https://github.com/unjs/ufo) library is used under the hood to parse and stringify URLs.
 *
 * @class StormURLBuilder
 */
export class StormURLBuilder {
  #url: StormURL;

  /**
   * Create a new URL builder
   *
   * @param url - The URL to build
   * @param options - The options for the URL builder
   * @returns The URL builder
   */
  public static create(
    url: string | StormURL,
    options?: StormURLBuilderOptions
  ) {
    return new StormURLBuilder(url, options);
  }

  /**
   * Create a new URL builder
   */
  protected constructor(
    url: string | StormURL,
    options?: StormURLBuilderOptions
  ) {
    const decode = options?.decode ?? true;

    const parsedURL = isString(url)
      ? decode
        ? parseURL(decodeURL(url))
        : parseURL(url)
      : url;

    this.#url = {
      __typename: "StormURL",
      queryParams: {},
      ...parsedURL,
      paths: parsedURL.pathname
        ? parsedURL.pathname.split("/").filter(Boolean)
        : []
    };
    if (this.#url.host) {
      this.withHost(this.#url.host);
    }
    if (this.#url.auth) {
      this.withAuth(this.#url.auth);
    }
  }

  public get _url(): StormURL {
    return this.#url;
  }

  // public join(...paths: string[]): UrlBuilder {
  //   this.#url = joinURL(this.#url., ...paths.map(param => decodePath(param)));
  //   return this;
  // }

  /**
   * Set the protocol of the URL
   *
   * @param protocol - The protocol to set
   * @returns The URL builder
   */
  public withProtocol(protocol: string): StormURLBuilder {
    this.#url.protocol = protocol;
    return this;
  }

  /**
   * Set the hostname of the URL
   *
   * @param hostname - The hostname to set
   * @returns The URL builder
   */
  public withHostname(hostname: string): StormURLBuilder {
    this.#url.hostname = hostname;
    return this;
  }

  /**
   * Set the port of the URL
   *
   * @param port - The port to set
   * @returns The URL builder
   */
  public withPort(port: number): StormURLBuilder {
    this.#url.port = String(port);
    return this;
  }

  /**
   * Set the username of the URL
   *
   * @param username - The username to set
   * @returns The URL builder
   */
  public withUsername(username: string): StormURLBuilder {
    this.#url.username = username;
    return this;
  }

  /**
   * Set the password of the URL
   *
   * @param password - The password to set
   * @returns The URL builder
   */
  public withPassword(password: string): StormURLBuilder {
    this.#url.password = password;
    return this;
  }

  /**
   * Set the host of the URL
   *
   * @param host - The host to set
   * @returns The URL builder
   */
  public withHost(host: string | ParsedHost): StormURLBuilder {
    if (isString(host)) {
      this.#url.host = host;

      const parsedAuth = parseAuth(host);
      this.#url.username = parsedAuth.username;
      this.#url.password = parsedAuth.password;
    } else {
      this.#url.hostname = host.hostname;
      this.#url.port = host.port;

      this.#url.auth = `${host.hostname}${host.port ? `:${host.port}` : ""}`;
    }
    return this;
  }

  /**
   * Set the path of the URL
   *
   * @param path - The path to set
   * @returns The URL builder
   */
  public withPath(path: string): StormURLBuilder {
    const parsedPath = parsePath(path.startsWith("/") ? path : `/${path}`);
    this.#url = {
      ...this.#url,
      ...parsedPath,
      paths: parsedPath.pathname.split("/").filter(Boolean)
    };

    return this;
  }

  /**
   * Set the hash of the URL
   *
   * @param hash - The hash to set
   * @returns The URL builder
   */
  public withHash(hash: string): StormURLBuilder {
    this.#url.hash = hash;
    return this;
  }

  /**
   * Set the auth of the URL
   *
   * @param auth - The auth to set
   * @returns The URL builder
   */
  public withAuth(auth: string | ParsedAuth): StormURLBuilder {
    if (isString(auth)) {
      this.#url.auth = auth;

      const parsedAuth = parseAuth(auth);
      this.#url.username = parsedAuth.username;
      this.#url.password = parsedAuth.password;
    } else {
      this.#url.username = auth.username;
      this.#url.password = auth.password;

      this.#url.auth = `${auth.username}:${auth.password}`;
    }

    return this;
  }

  /**
   * Set the query of the URL
   *
   * @param query - The query to set
   * @returns The URL builder
   */
  public withQuery(
    query: string | [string, any] | Record<string, any>
  ): StormURLBuilder {
    this.#url.queryParams = {} as Record<string, any>;
    this.addQueryParam(query);

    return this;
  }

  /**
   * Add a query parameter to the URL
   *
   * @param queryParam - The query parameter to add
   * @returns The URL builder
   */
  public addQueryParam(
    queryParam: string | [string, any] | Record<string, any>
  ): StormURLBuilder {
    if (isString(queryParam)) {
      const parsedQuery: Record<string, string | string[]> =
        parseQuery(queryParam);
      for (const entry of Object.entries(parsedQuery)) {
        if (entry[0]) {
          this.#url.queryParams[entry[0]] = this.parseQueryParamValue(entry[1]);
        }
      }
    } else if (Array.isArray(queryParam) && queryParam.length === 2) {
      this.#url.queryParams[queryParam[0]] = this.parseQueryParamValue(
        queryParam[1]
      );
    } else {
      for (const entry of Object.entries(queryParam)) {
        if (entry[0]) {
          this.#url.queryParams[entry[0]] = this.parseQueryParamValue(entry[1]);
        }
      }
    }

    return this;
  }

  /**
   * Returns the built URL
   *
   * @returns The built URL
   */
  public build(): StormURL {
    return this.#url;
  }

  /**
   * Returns the string representation of the URL
   *
   * @returns The string representation of the URL
   */
  public toString(): string {
    return cleanDoubleSlashes(stringifyParsedURL(this.#url));
  }

  /**
   * Returns the encoded string representation of the URL
   *
   * @returns The encoded string representation of the URL
   */
  public toEncoded(): string {
    return encodeURL(this.toString());
  }

  /**
   * Parse a query parameter value
   *
   * @param value - The value to parse
   * @returns The parsed value
   */
  private parseQueryParamValue(value: any): any {
    if (Array.isArray(value)) {
      const values = [];
      for (const item of value) {
        values.push(this.parseQueryParamValue(item));
      }
      return values;
    }
    return StormJSON.parse(value);
  }
}
