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

"use client";

/* eslint-disable camelcase */

import { loggerLink } from "@trpc/client";
import type { UseTRPCActionResult } from "@trpc/next/app-dir/client";
import {
  experimental_createActionHook,
  experimental_createTRPCNextAppDirClient,
  experimental_serverActionLink
} from "@trpc/next/app-dir/client";
import { experimental_nextHttpLink } from "@trpc/next/app-dir/links/nextHttp";
import type {
  ActionHandlerDef,
  TRPCActionHandler
} from "@trpc/next/app-dir/server";
import type { AnyTRPCRouter } from "@trpc/server";
import { getTRPCServerUrl, transformer } from "./shared";

/**
 * Creates a tRPC client for the Next.js app directory.
 *
 * @param baseUrl - The base URL for the tRPC server. This is typically the URL of the Next.js app.
 * @returns A tRPC client that can be used to make requests to the server.
 */
export function createTRPCClient<TRouter extends AnyTRPCRouter>(
  baseUrl: string
) {
  return experimental_createTRPCNextAppDirClient<TRouter>({
    config() {
      return {
        links: [
          loggerLink({
            enabled: _op => true
          }),
          experimental_nextHttpLink({
            transformer,
            batch: true,
            url: getTRPCServerUrl(baseUrl),
            headers() {
              return {
                "x-trpc-source": "client"
              };
            }
          } as TRouter["_def"]["_config"]["$types"])
        ]
      };
    }
  });
}

/**
 * Creates a tRPC action hook for the Next.js app directory.
 *
 * @returns A function that can be used to create a tRPC action hook.
 */
export function createUseAction<TRouter extends AnyTRPCRouter>() {
  return experimental_createActionHook<TRouter>({
    links: [
      loggerLink(),
      experimental_serverActionLink({
        transformer
      } as TRouter["_def"]["_config"]["$types"])
    ]
  } as TRouter["_def"]["_config"]["$types"]) as <TDef extends ActionHandlerDef>(
    handler: TRPCActionHandler<TDef>,
    useActionOpts?: any
  ) => UseTRPCActionResult<TDef>;
}
