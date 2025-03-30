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

import {
  Rule,
  RuleAnd,
  RuleChain,
  RuleFalse,
  RuleNot,
  RuleOr,
  RuleRace,
  RuleTrue
} from "./rules";
import type {
  IRuleConstructorOptions,
  IRuleFunction,
  ShieldRule
} from "./types";

/**
 * Wraps a function into a Rule class. This way we can identify rules
 * once we start generating middleware from our ruleTree.
 *
 * ```
 * // 1.
 * const auth = rule()(async (ctx, type, path, input, rawInput, options) => {
 *  return true
 * })
 *
 * // 2.
 * const auth = rule('name')(async (ctx, type, path, input, rawInput, options) => {
 *  return true
 * })
 *
 * // 3.
 * const auth = rule({
 *  name: 'name',
 * })(async (ctx, type, path, input, rawInput, options) => {
 *  return true
 * })
 * ```
 */
export const rule =
  <TContext extends Record<string, any>>(
    name?: string,
    options?: IRuleConstructorOptions
  ) =>
  (func: IRuleFunction<TContext>): Rule<TContext> => {
    if (typeof name === "object") {
      options = name;
      name = Math.random().toString();
    } else if (typeof name === "string") {
      options = options ?? {};
    } else {
      name = Math.random().toString();
      options = {};
    }

    // @ts-ignore
    return new Rule(name, func, {});
  };

/**
 * Logical operator and serves as a wrapper for and operation.
 */
export const and = <TContext extends Record<string, any>>(
  ...rules: ShieldRule<TContext>[]
): RuleAnd<TContext> => {
  return new RuleAnd(rules);
};

/**
 * Logical operator and serves as a wrapper for and operation.
 */
export const chain = <TContext extends Record<string, any>>(
  ...rules: ShieldRule<TContext>[]
): RuleChain<TContext> => {
  return new RuleChain(rules);
};

/**
 * Logical operator and serves as a wrapper for and operation.
 */
export const race = <TContext extends Record<string, any>>(
  ...rules: ShieldRule<TContext>[]
): RuleRace<TContext> => {
  return new RuleRace(rules);
};

/**
 * Logical operator or serves as a wrapper for or operation.
 */
export const or = <TContext extends Record<string, any>>(
  ...rules: ShieldRule<TContext>[]
): RuleOr<TContext> => {
  return new RuleOr(rules);
};

/**
 * Logical operator not serves as a wrapper for not operation.
 */
export const not = <TContext extends Record<string, any>>(
  rule: ShieldRule<TContext>,
  error?: string | Error
): RuleNot<TContext> => {
  if (typeof error === "string") return new RuleNot(rule, new Error(error));
  return new RuleNot(rule, error);
};

/**
 * Allow queries.
 */
export const allow = new RuleTrue();

/**
 * Deny queries.
 */
export const deny = new RuleFalse();
