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

import type {
  IRules,
  LogicRuleInterface,
  RuleInterface,
  ShieldRule
} from "./types";
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
    map: Map<string, RuleInterface<TContext>>;
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
    { map: new Map<string, RuleInterface<TContext>>(), duplicates: [] }
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
  ): RuleInterface<TContext>[] {
    const resolvers = flattenObjectOf<ShieldRule<TContext>>(
      ruleTree,
      isRuleFunction
    );

    const rules = resolvers.reduce<RuleInterface<TContext>[]>((rules, rule) => {
      if (isLogicRule(rule)) {
        return [
          ...rules,
          ...extractLogicRules(rule)
        ] as RuleInterface<TContext>[];
      } else {
        return [...rules, rule] as RuleInterface<TContext>[];
      }
    }, []);

    return rules;
  }

  /**
   * Recursively extracts Rules from LogicRule
   */
  function extractLogicRules<TContext extends Record<string, any>>(
    rule: LogicRuleInterface<TContext>
  ): RuleInterface<TContext>[] {
    return rule
      .getRules()
      .reduce<RuleInterface<TContext>[]>((acc, shieldRule) => {
        if (isLogicRule(shieldRule)) {
          return [
            ...acc,
            ...extractLogicRules(shieldRule)
          ] as RuleInterface<TContext>[];
        } else {
          return [...acc, shieldRule] as RuleInterface<TContext>[];
        }
      }, []);
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}
