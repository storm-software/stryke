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

import type { ILogicRule, IRule, IRules, ShieldRule } from "./types";
import { flattenObjectOf, isLogicRule, isRuleFunction } from "./utils";

/**
 * Validates the rule tree declaration by checking references of rule
 * functions. We deem rule tree valid if no two rules with the same name point
 * to different rules.
 */
export function validateRuleTree<TContext extends Record<string, any>>(
  ruleTree: IRules<TContext>
): { status: "ok" } | { status: "err"; message: string } {
  const rules = extractRules(ruleTree);

  const valid = rules.reduce<{
    map: Map<string, IRule<TContext>>;
    duplicates: string[];
  }>(
    ({ map, duplicates }, rule) => {
      if (!map.has(rule.name)) {
        return { map: map.set(rule.name, rule), duplicates };
      } else if (
        !map.get(rule.name)!.equals(rule) &&
        !duplicates.includes(rule.name)
      ) {
        return {
          map: map.set(rule.name, rule),
          duplicates: [...duplicates, rule.name]
        };
      } else {
        return { map, duplicates };
      }
    },
    { map: new Map<string, IRule<TContext>>(), duplicates: [] }
  );

  if (valid.duplicates.length === 0) {
    return { status: "ok" };
  } else {
    const duplicates = valid.duplicates.join(", ");

    return {
      status: "err",
      message: `There seem to be multiple definitions of these rules: ${duplicates}`
    };
  }

  /**
   * Extracts rules from rule tree.
   */
  function extractRules<TContext extends Record<string, any>>(
    ruleTree: IRules<TContext>
  ): IRule<TContext>[] {
    const resolvers = flattenObjectOf<ShieldRule<TContext>>(
      ruleTree,
      isRuleFunction
    );

    const rules = resolvers.reduce<IRule<TContext>[]>((rules, rule) => {
      if (isLogicRule(rule)) {
        return [...rules, ...extractLogicRules(rule)] as IRule<TContext>[];
      } else {
        return [...rules, rule] as IRule<TContext>[];
      }
    }, []);

    return rules;
  }

  /**
   * Recursively extracts Rules from LogicRule
   */
  function extractLogicRules<TContext extends Record<string, any>>(
    rule: ILogicRule<TContext>
  ): IRule<TContext>[] {
    return rule.getRules().reduce<IRule<TContext>[]>((acc, shieldRule) => {
      if (isLogicRule(shieldRule)) {
        return [...acc, ...extractLogicRules(shieldRule)] as IRule<TContext>[];
      } else {
        return [...acc, shieldRule] as IRule<TContext>[];
      }
    }, []);
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}
