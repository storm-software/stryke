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

import type { MiddlewareFunction } from "@trpc/server/unstable-core-do-not-import";
import { allow } from "./constructors";
import { generateMiddlewareFromRuleTree } from "./generator";
import type {
  IFallbackErrorType,
  IRules,
  OptionsConstructorInterface,
  OptionsInterface,
  ShieldRule
} from "./types";
import { withDefault } from "./utils";
import { ValidationError, validateRuleTree } from "./validation";

/**
 * Makes sure all of defined rules are in accord with the options
 * shield can process.
 */
function normalizeOptions<TContext extends Record<string, any>>(
  options: OptionsConstructorInterface<TContext>
): OptionsInterface<TContext> {
  if (typeof options.fallbackError === "string") {
    options.fallbackError = new Error(options.fallbackError);
  }

  return {
    debug: options.debug ?? false,
    allowExternalErrors: withDefault(false)(options.allowExternalErrors),
    fallbackRule: withDefault<ShieldRule<TContext>>(
      allow as ShieldRule<TContext>
    )(options.fallbackRule),
    fallbackError: withDefault<IFallbackErrorType<TContext>>(
      new Error("Authorization error")
    )(options.fallbackError)
  };
}

/**
 * Validates rules and generates middleware from defined rule tree.
 */
export function shield<
  TContext extends Record<string, any>,
  TMeta extends object = object
>(
  ruleTree: IRules<TContext>,
  options: OptionsConstructorInterface<TContext> = {}
): MiddlewareFunction<TContext, TMeta, TContext, TContext, unknown> {
  const normalizedOptions = normalizeOptions<TContext>(options);
  const ruleTreeValidity = validateRuleTree<TContext>(ruleTree);

  if (ruleTreeValidity.status === "ok") {
    return generateMiddlewareFromRuleTree<TContext>(
      ruleTree,
      normalizedOptions
    ) as any;
  } else {
    throw new ValidationError(ruleTreeValidity.message);
  }
}
