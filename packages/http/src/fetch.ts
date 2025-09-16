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

import { Buffer } from "node:buffer";
import http from "node:http";
import https from "node:https";
import { getProxyAgent } from "./proxy-agent";

export interface FetchRequestOptions {
  isDev?: boolean;
}

/**
 * Fetches a resource from a URL.
 *
 * @remarks
 * Makes a simple GET request and returns the entire response as a Buffer.
 *
 * Features:
 * - Throws if the response status is not 200.
 * - Applies a 3000 ms timeout when `isDev` is `true`.
 *
 * @param url - The URL to fetch.
 * @returns A promise that resolves to the response body as a Buffer.
 */
export async function $fetch(
  url: string,
  options: FetchRequestOptions = {}
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const { protocol } = new URL(url);
    const client = protocol === "https:" ? https : http;
    const timeout = options.isDev ? 3000 : undefined;

    const req = client.request(
      url,
      {
        agent: getProxyAgent(),
        headers: {
          // The file format is based off of the user agent, make sure woff2 files are fetched
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) " +
            "AppleWebKit/537.36 (KHTML, like Gecko) " +
            "Chrome/104.0.0.0 Safari/537.36"
        }
      },
      res => {
        if (res.statusCode !== 200) {
          reject(
            new Error(`Request failed: ${url} (status: ${res.statusCode})`)
          );
          return;
        }
        const chunks: Buffer[] = [];
        res.on("data", chunk => chunks.push(Buffer.from(chunk)));
        res.on("end", () => resolve(Buffer.concat(chunks)));
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

export const fetch = $fetch;
