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

import { bufferToString } from "@stryke/convert/buffer-to-string";
import { StormJSON } from "@stryke/json/storm-json";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { isURL } from "@stryke/type-checks/is-url";
import { isValidURL } from "@stryke/url/helpers";
import { defu } from "defu";
import { Buffer } from "node:buffer";
import http from "node:http";
import type { RequestOptions } from "node:https";
import https from "node:https";
import { getProxyAgent } from "./proxy-agent";

export interface FetchRequestOptions extends RequestOptions {
  /**
   * Timeout in milliseconds
   *
   * @defaultValue 3000
   */
  timeout?: number;
}

export interface FetchResponse extends Buffer {
  /**
   * Parses the response body as JSON.
   *
   * @typeParam T - The type to parse the JSON as.
   * @returns The parsed JSON object.
   */
  json: <T extends object = Record<string, any>>() => T;

  /**
   * Converts the response body to a string.
   *
   * @returns The response body as a string.
   */
  text: () => string;
}

/**
 * Fetches a resource from a URL.
 *
 * @remarks
 * Makes a simple GET request and returns the entire response as a Buffer. Throws if the response status is not 200.
 *
 * @param url - The URL to fetch.
 * @returns A promise that resolves to the response body as a Buffer.
 */
export async function fetchRequest(
  url: string | URL,
  options: FetchRequestOptions = {}
): Promise<FetchResponse> {
  return new Promise((resolve, reject) => {
    let protocol = "http:";
    if (isSetString(url)) {
      if (!isValidURL(url)) {
        reject(new Error(`Invalid URL format provided: ${url}`));
        return;
      }

      const parsedUrl = new URL(url);
      protocol = parsedUrl.protocol;
    } else if (isURL(url)) {
      protocol = url.protocol;
    } else {
      reject(new Error("Invalid URL provided to fetch"));
      return;
    }

    const client = protocol === "https:" ? https : http;
    const timeout = options.timeout ?? 3000;

    const req = client.request(
      url,
      defu(options, {
        agent: getProxyAgent(),
        headers: {
          // The file format is based off of the user agent, make sure woff2 files are fetched
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) " +
            "AppleWebKit/537.36 (KHTML, like Gecko) " +
            "Chrome/104.0.0.0 Safari/537.36"
        }
      }) as Parameters<typeof client.request>[1],
      res => {
        if (res.statusCode !== 200) {
          reject(
            new Error(
              `Request failed: ${url.toString()} (status: ${res.statusCode})`
            )
          );
          return;
        }

        const chunks: Buffer[] = [];
        res.on("data", chunk => chunks.push(Buffer.from(chunk)));
        res.on("end", () => {
          const body = Buffer.concat(chunks) as FetchResponse;
          body.text = () => bufferToString(body);
          body.json = <T extends object = Record<string, any>>() =>
            StormJSON.parse<T>(body.text());

          resolve(body);
        });
      }
    );

    if (timeout) {
      req.setTimeout(timeout, () => {
        req.destroy(new Error(`Request timed out after ${timeout}ms`));
      });
    }

    req.on("error", err => reject(err));
    req.end();
  });
}

export const fetch = fetchRequest;

/**
 * Fetches a string resource from a URL.
 *
 * @param url - The URL to fetch.
 * @returns A promise that resolves to the response body as a Buffer.
 */
export async function fetchString(
  url: string | URL,
  options: FetchRequestOptions = {}
): Promise<string> {
  const response = await fetchRequest(url, options);

  return response.text();
}

/**
 * Fetches a JSON resource from a URL.
 *
 * @param url - The URL to fetch.
 * @returns A promise that resolves to the response body as a Buffer.
 */
export async function fetchJSON<T extends object = Record<string, any>>(
  url: string | URL,
  options: FetchRequestOptions = {}
): Promise<T> {
  const response = await fetchRequest(url, options);

  return response.json<T>();
}
