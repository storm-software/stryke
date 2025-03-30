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

import type { MiddlewareFunction } from "@trpc/server/unstable-core-do-not-import";
import { allow } from "./constructors";
import { generateMiddlewareFromRuleTree } from "./generator";
import type {
  IFallbackErrorType,
  IOptions,
  IOptionsConstructor,
  IRules,
  ShieldRule
} from "./types";
import { withDefault } from "./utils";
import { ValidationError, validateRuleTree } from "./validation";

/**
 * Makes sure all of defined rules are in accord with the options
 * shield can process.
 */
function normalizeOptions<TContext extends Record<string, any>>(
  options: IOptionsConstructor<TContext>
): IOptions<TContext> {
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
      new Error("Not Authorised!")
    )(options.fallbackError)
  };
}

/**
 * Validates rules and generates middleware from defined rule tree.
 */
export function shield<
  TContext extends Record<string, any>,
  TMeta extends object = object,
  TContextOverridesIn = TContext,
  $ContextOverridesOut = TContext,
  TInputOut = unknown
>(
  ruleTree: IRules<TContext>,
  options: IOptionsConstructor<TContext> = {}
): MiddlewareFunction<
  TContext,
  TMeta,
  TContextOverridesIn,
  $ContextOverridesOut,
  TInputOut
> {
  const normalizedOptions = normalizeOptions(options);
  const ruleTreeValidity = validateRuleTree(ruleTree);

  if (ruleTreeValidity.status === "ok") {
    return generateMiddlewareFromRuleTree(ruleTree, normalizedOptions) as any;
  } else {
    throw new ValidationError(ruleTreeValidity.message);
  }
}
