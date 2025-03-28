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
