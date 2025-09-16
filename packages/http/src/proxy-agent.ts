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

import type { Agent } from "node:https";
import { HttpProxyAgent } from "./http-proxy";
import { HttpsProxyAgent } from "./https-proxy";

/**
 * If the http(s)_proxy environment variables is set, return a proxy agent.
 */
export function getProxyAgent(): Agent | undefined {
  const httpsProxy = process.env.https_proxy || process.env.HTTPS_PROXY;
  if (httpsProxy) {
    return new HttpsProxyAgent(httpsProxy);
  }

  const httpProxy = process.env.http_proxy || process.env.HTTP_PROXY;
  if (httpProxy) {
    return new HttpProxyAgent(httpProxy);
  }

  return undefined;
}
