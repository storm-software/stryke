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

import { isSetString } from "@stryke/type-checks/is-set-string";
import { isURL } from "@stryke/type-checks/is-url";
import { isValidURL } from "@stryke/url/helpers";
import { defu } from "defu";
import type { UrlObject } from "node:url";
import type { Dispatcher } from "undici";
import { request } from "undici";
import { getProxyAgent } from "./proxy-agent";

export type FetchRequestOptions<T = null> = { dispatcher?: Dispatcher } & Omit<
  Dispatcher.RequestOptions<T>,
  "origin" | "path" | "method"
> &
  Partial<Pick<Dispatcher.RequestOptions, "method">> & {
    /**
     * Timeout in milliseconds
     *
     * @defaultValue 5000
     */
    timeout?: number;
  };

/**
 * Fetches a resource from a URL.
 *
 * @param url - The URL to fetch.
 * @returns A promise that resolves to the response.
 */
export async function fetchRequest<T = null>(
  url: string | URL | UrlObject,
  options: FetchRequestOptions<T> = {}
) {
  if (isSetString(url)) {
    if (!isValidURL(url)) {
      throw new Error(`Invalid URL format provided: ${url}`);
    }
  } else if (!isURL(url)) {
    throw new Error("Invalid URL provided to fetch");
  }

  const abort = new AbortController();
  setTimeout(() => abort.abort(), options.timeout ?? 5000);

  return request<T>(
    url,
    defu(options, {
      agent: getProxyAgent(),
      signal: abort.signal,
      headers: {
        // The file format is based off of the user agent, make sure woff2 files are fetched
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) " +
          "AppleWebKit/537.36 (KHTML, like Gecko) " +
          "Chrome/104.0.0.0 Safari/537.36"
      }
    })
  );
}

export const fetch = fetchRequest;
