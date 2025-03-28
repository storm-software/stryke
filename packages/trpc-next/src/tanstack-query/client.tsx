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

import { isDevelopment } from "@stryke/env/environment-checks";
import type { StormURL } from "@stryke/http/types";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createTRPCClient,
  httpBatchStreamLink,
  loggerLink
} from "@trpc/client";
import type { AnyTRPCRouter } from "@trpc/server";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import { useState } from "react";
import { getTRPCServerUrl, transformer } from "../shared";

export function createTRPCTanstackQueryClient<TRouter extends AnyTRPCRouter>() {
  const { TRPCProvider, useTRPC } = createTRPCContext<TRouter>();

  return {
    useTRPCTanstackQuery: useTRPC,
    TRPCTanstackQueryProvider(props: {
      children: React.ReactNode;
      baseUrl: string | StormURL;
      queryClient: QueryClient;
    }) {
      const { children, baseUrl, queryClient } = props;

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
            <ReactQueryDevtools />
          </QueryClientProvider>
        </TRPCProvider>
      );
    }
  };
}
