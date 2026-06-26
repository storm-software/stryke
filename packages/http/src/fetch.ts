/* -------------------------------------------------------------------

                       🗲 Storm Software - Stryke

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
import { contentType } from "mime-types";
import { parseFilename } from "ufo";
import type { RequestInfo, RequestInit } from "undici";
import { fetch as undici } from "undici";

export type FetchRequestOptions = RequestInit & {
  /**
   * Timeout in milliseconds
   *
   * @defaultValue 5000
   */
  timeout?: number;

  /**
   * Number of retries for the fetch request
   *
   * @defaultValue 3
   */
  retries?: number;

  /**
   * Delay between retries in milliseconds
   *
   * @defaultValue 1000
   */
  retryDelay?: number;

  /**
   * Function to determine if a retry should be attempted based on the error and attempt number
   */
  retryOn?: (error: any, attempt: number) => boolean;
};

export const DEFAULT_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36";

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

  const {
    retries = 3,
    retryDelay = 1000,
    retryOn,
    timeout = 5000,
    ...requestOptions
  } = options;

  const type = contentType(parseFilename(input.toString()) || "");

  const delay = async (ms: number) =>
    new Promise(resolve => {
      setTimeout(resolve, ms);
    });

  for (let attempt = 0; ; attempt++) {
    const abort = new AbortController();
    const timeoutId = setTimeout(() => abort.abort(), timeout);

    try {
      const response = await undici(
        input,
        defu(
          requestOptions,
          {
            signal: abort.signal,
            headers: {
              "User-Agent": DEFAULT_USER_AGENT
            }
          },
          type
            ? {
                headers: {
                  "Content-Type": type,
                  Accept: type
                }
              }
            : {}
        )
      );

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);

      const shouldRetry = retryOn ? retryOn(error, attempt + 1) : true;
      if (attempt >= retries || !shouldRetry) {
        throw error;
      }

      if (retryDelay > 0) {
        await delay(retryDelay);
      }
    }
  }
}

export const fetch = fetchRequest;
