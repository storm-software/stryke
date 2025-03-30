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

import type { MaybePromise } from "@stryke/types";
import type { QueryClientConfig } from "@tanstack/react-query";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { AnyTRPCRouter, inferRouterContext } from "@trpc/server";
import type { TRPCQueryOptions } from "@trpc/tanstack-react-query";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import defu from "defu";
import { headers } from "next/headers";
import React, { cache } from "react";
import "server-only";
import { createQueryClient } from "../shared";

/**
 * Create a TRPC Tanstack Query server.
 *
 * @param router - The TRPC router
 * @param createContext - The context creator function
 * @param config - The query client config
 * @returns The TRPC Tanstack Query server
 */
export function createTRPCTanstackQueryServer<
  TRouter extends AnyTRPCRouter,
  TContext extends inferRouterContext<TRouter>
>(
  router: TRouter,
  createContext: () => MaybePromise<TContext> = () => ({}) as TContext,
  config?: Partial<QueryClientConfig>
) {
  const _createContext = cache(async (): Promise<TContext> => {
    const context = await Promise.resolve(createContext());

    const _headers = new Headers(await headers());
    _headers.set("x-trpc-source", "rsc");

    return defu(
      {
        headers: Object.fromEntries(_headers)
      },
      context
    ) as TContext;
  });

  /**
   * Create a stable getter for the query client that
   * will return the same client during the same request.
   */
  const getQueryClient = cache(() => createQueryClient(config));

  const trpc = createTRPCOptionsProxy({
    router,
    queryClient: getQueryClient,
    ctx: _createContext
  });

  return {
    trpc,
    HydrateClient(props: { children: React.ReactNode }) {
      const dehydratedState = dehydrate(getQueryClient());

      return (
        <HydrationBoundary state={dehydratedState}>
          {props.children}
        </HydrationBoundary>
      );
    },
    prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(queryOptions: T) {
      const queryClient = getQueryClient();
      if (queryOptions.queryKey[1]?.type === "infinite") {
        void queryClient.prefetchInfiniteQuery(queryOptions as any);
      } else {
        void queryClient.prefetchQuery(queryOptions);
      }
    }
  };
}
