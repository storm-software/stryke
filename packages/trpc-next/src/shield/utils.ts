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

import { LogicRule, Rule } from "./rules";
import type {
  LogicRuleInterface,
  RuleFieldMapInterface,
  RuleInterface,
  ShieldRule
} from "./types";

/**
 * Makes sure that a certain field is a rule.
 */
export function isRule<TContext extends Record<string, any>>(
  x: any
): x is RuleInterface<TContext> {
  return (
    x instanceof Rule || (x && x.constructor && x.constructor.name === "Rule")
  );
}

/**
 * Makes sure that a certain field is a logic rule.
 */
export function isLogicRule<TContext extends Record<string, any>>(
  x: any
): x is LogicRuleInterface<TContext> {
  return (
    x instanceof LogicRule ||
    (x &&
      x.constructor &&
      (x.constructor.name === "RuleOr" ||
        x.constructor.name === "RuleAnd" ||
        x.constructor.name === "RuleChain" ||
        x.constructor.name === "RuleRace" ||
        x.constructor.name === "RuleNot" ||
        x.constructor.name === "RuleTrue" ||
        x.constructor.name === "RuleFalse"))
  );
}

/**
 * Makes sure that a certain field is a rule or a logic rule.
 */
export function isRuleFunction<TContext extends Record<string, any>>(
  x: any
): x is ShieldRule<TContext> {
  return isRule(x) || isLogicRule(x);
}

/**
 * Determines whether a certain field is rule field map or not.
 */
export function isRuleFieldMap<TContext extends Record<string, any>>(
  x: any
): x is RuleFieldMapInterface<TContext> {
  return (
    typeof x === "object" &&
    Object.values(x).every(rule => isRuleFunction(rule))
  );
}

/**
 * Flattens object of particular type by checking if the leaf
 * evaluates to true from particular function.
 */
export function flattenObjectOf<T>(
  obj: { [key: string]: any },
  f: (x: any) => boolean
): T[] {
  const values = Object.keys(obj).reduce<T[]>((acc, key) => {
    const val = obj[key];
    if (f(val)) {
      return [...acc, val];
    } else if (typeof val === "object" && !f(val)) {
      return [...acc, ...flattenObjectOf(val, f)];
    } else {
      return acc;
    }
  }, []);

  return values;
}

/**
 * Returns fallback is provided value is undefined
 */
export function withDefault<T>(fallback: T): (value: T | undefined) => T {
  return value => {
    if (value === undefined) return fallback;
    return value;
  };
}
