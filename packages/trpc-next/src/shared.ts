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

import { Temporal } from "@js-temporal/polyfill";
import { joinPaths } from "@stryke/path/join-paths";
import type { StormURLInterface } from "@stryke/url/types";
import type { QueryClientConfig } from "@tanstack/react-query";
import {
  defaultShouldDehydrateQuery,
  QueryClient
} from "@tanstack/react-query";
import type { DataTransformer } from "@trpc/server/unstable-core-do-not-import";
import defu from "defu";
import superjson from "superjson";

export function getTRPCServerUrl(
  baseUrl: string | StormURLInterface,
  version: number | null = 1
) {
  return joinPaths(
    typeof baseUrl === "string" ? baseUrl : baseUrl.host || "",
    "api",
    version ? `v${version}` : "",
    "trpc"
  );
}

superjson.registerCustom(
  {
    isApplicable: (v): v is Temporal.PlainDate =>
      v instanceof Temporal.PlainDate,
    serialize: v => v.toJSON(),
    deserialize: v => Temporal.PlainDate.from(v)
  },
  "Temporal.PlainDate"
);

superjson.registerCustom(
  {
    isApplicable: (v): v is Temporal.PlainDateTime =>
      v instanceof Temporal.PlainDateTime,
    serialize: v => v.toJSON(),
    deserialize: v => Temporal.PlainDateTime.from(v)
  },
  "Temporal.PlainDateTime"
);

export const transformer = superjson as DataTransformer;

/**
 * Create a TRPC Tanstack Query client.
 *
 * @param queryClientConfig - The query client config
 * @returns The TRPC Tanstack Query client
 */
export const createQueryClient = (
  queryClientConfig: Partial<QueryClientConfig> = {}
) =>
  new QueryClient(
    defu(queryClientConfig, {
      defaultOptions: {
        queries: {
          // Since queries are prefetched on the server, we set a stale time so that
          // queries aren't immediately re-fetched on the client
          staleTime: 1000 * 30
        },
        dehydrate: {
          // include pending queries in dehydration
          // this allows us to prefetch in RSC and
          // send promises over the RSC boundary
          shouldDehydrateQuery: (query: any) =>
            defaultShouldDehydrateQuery(query) ||
            query.state.status === "pending",
          serializeData: transformer.serialize
        },
        hydrate: {
          deserializeData: transformer.deserialize
        }
      }
    })
  );
