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

/* eslint-disable camelcase */

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
import type { Resolver } from "@trpc/client";
import { loggerLink } from "@trpc/client";
import { experimental_nextCacheLink } from "@trpc/next/app-dir/links/nextCache";
import { experimental_createTRPCNextAppDirServer } from "@trpc/next/app-dir/server";
import type { AnyTRPCRouter, inferRouterContext } from "@trpc/server";
import type {
  AnyProcedure,
  AnyRootTypes,
  inferProcedureInput,
  inferTransformedProcedureOutput,
  ProcedureType,
  RouterRecord
} from "@trpc/server/unstable-core-do-not-import";
import type { ResolverDef } from "@trpc/tanstack-react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { transformer } from "./shared";

export type DecorateProcedureServer<
  TType extends ProcedureType,
  TDef extends ResolverDef
> = TType extends "query"
  ? {
      query: Resolver<TDef>;
      revalidate: (
        input?: TDef["input"]
      ) => Promise<
        { revalidated: false; error: string } | { revalidated: true }
      >;
    }
  : TType extends "mutation"
    ? {
        mutate: Resolver<TDef>;
      }
    : TType extends "subscription"
      ? {
          subscribe: Resolver<TDef>;
        }
      : never;

export type NextAppDirDecorateRouterRecord<
  TRoot extends AnyRootTypes,
  TRecord extends RouterRecord
> = {
  [TKey in keyof TRecord]: TRecord[TKey] extends infer $Value
    ? $Value extends AnyProcedure
      ? DecorateProcedureServer<
          $Value["_def"]["type"],
          {
            input: inferProcedureInput<$Value>;
            output: inferTransformedProcedureOutput<TRoot, $Value>;
            errorShape: TRoot["errorShape"];
            transformer: TRoot["transformer"];
          }
        >
      : $Value extends RouterRecord
        ? NextAppDirDecorateRouterRecord<TRoot, $Value>
        : never
    : never;
};

/**
 * This client invokes procedures directly on the server without fetching over HTTP.
 *
 * @param router - The router created by the user
 * @param createContext - An optional function to generate a context
 */
export function createTRPCServer<
  TRouter extends AnyTRPCRouter,
  TContext extends inferRouterContext<TRouter> = inferRouterContext<TRouter>
>(
  cookies: () => Promise<ReadonlyRequestCookies>,
  router: TRouter,
  createContext: () => MaybePromise<TContext> = () => ({}) as TContext
) {
  return experimental_createTRPCNextAppDirServer<TRouter>({
    config() {
      return {
        links: [
          loggerLink({
            enabled: _op => true
          }),
          experimental_nextCacheLink({
            // requests are cached for 5 seconds
            revalidate: 5,
            router,
            transformer,
            createContext: async () => {
              const context = await Promise.resolve(createContext());

              context.headers ??= {};
              context.headers["x-trpc-source"] = "rsc-invoke";
              context.headers.cookie = (await cookies()).toString();

              return context;
            }
          })
        ]
      };
    }
  }) as NextAppDirDecorateRouterRecord<
    TRouter["_def"]["_config"]["$types"],
    TRouter["_def"]["record"]
  >;
}

export {
  experimental_notFound as notFound,
  experimental_redirect as redirect
} from "@trpc/server/adapters/next-app-dir";
