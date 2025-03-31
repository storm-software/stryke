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

import type { MaybePromise } from "@stryke/types";
import { experimental_createServerActionHandler } from "@trpc/next/app-dir/server";
import type {
  AnyRootTypes,
  RootConfig
} from "@trpc/server/unstable-core-do-not-import";
import defu from "defu";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import type { BaseContext } from "./types";

/**
 * This client invokes procedures directly on the server without fetching over HTTP.
 *
 * @param t - The tRPC instance
 * @param createContext - An optional function to generate a context
 */
export function createTRPCServerActionHandler<
  TInstance extends {
    _config: RootConfig<AnyRootTypes>;
  },
  TContext extends BaseContext = BaseContext
>(
  cookies: () => Promise<ReadonlyRequestCookies>,
  t: TInstance,
  createContext: () => MaybePromise<TContext> = async () => ({}) as TContext
) {
  return experimental_createServerActionHandler(t, {
    createContext: async () => {
      const context = await Promise.resolve(createContext());

      return defu(context, {
        headers: {
          // Pass the cookie header to the API
          cookies: (await cookies()).toString() ?? ""
        }
      });
    }
  });
}
