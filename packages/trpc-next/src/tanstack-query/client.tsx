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

import { isDevelopment } from "@stryke/env/environment-checks";
import type { StormURLInterface } from "@stryke/url/types";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  createTRPCClient,
  httpBatchStreamLink,
  loggerLink
} from "@trpc/client";
import type { AnyTRPCRouter } from "@trpc/server";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import { useState } from "react";
import { getTRPCServerUrl, transformer } from "../shared";

/**
 * Create a TRPC Tanstack Query client.
 *
 * @returns The TRPC Tanstack Query client
 */
export function createTRPCTanstackQueryClient<TRouter extends AnyTRPCRouter>(
  baseUrl: string | StormURLInterface,
  queryClient: QueryClient
) {
  const { TRPCProvider, useTRPC } = createTRPCContext<TRouter>();

  return {
    useTRPCTanstackQuery: useTRPC,
    TRPCTanstackQueryProvider: (props: { children: React.ReactNode }) => {
      const { children } = props;

      const [trpcClient] = useState(() =>
        createTRPCClient<TRouter>({
          links: [
            loggerLink({
              enabled: op =>
                isDevelopment ||
                (op.direction === "down" && op.result instanceof Error)
            }),
            httpBatchStreamLink<TRouter>({
              transformer,
              url: getTRPCServerUrl(baseUrl),
              headers: { "x-trpc-source": "react-query" }
            } as TRouter["_def"]["_config"]["$types"])
          ]
        })
      );

      return (
        <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </TRPCProvider>
      );
    }
  };
}
