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
import { isValidURL } from "@stryke/url/helpers";
import { defu } from "defu";
import type { RequestInfo } from "undici";
import { fetch as undiciFetch } from "undici";
import { getProxyAgent } from "./proxy-agent";

export type FetchRequestOptions = RequestInit & {
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
 * @param input - The URL to fetch.
 * @param options - Additional fetch options.
 * @returns The fetched response.
 */
export async function fetchRequest(
  input: RequestInfo,
  options: FetchRequestOptions = {}
) {
  if (isSetString(input) && !isValidURL(input)) {
    throw new Error(`Invalid URL format provided: ${input}`);
  }

  const abort = new AbortController();
  setTimeout(() => abort.abort(), options.timeout ?? 5000);

  return undiciFetch(
    input,
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
