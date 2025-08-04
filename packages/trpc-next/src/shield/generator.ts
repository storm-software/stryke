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

import type { IRules, OptionsInterface, ShieldRule } from "./types";

/**
 * Generates middleware from given rules.
 */
export function generateMiddlewareFromRuleTree<
  TContext extends Record<string, unknown>
>(ruleTree: IRules<TContext>, options: OptionsInterface<TContext>) {
  return async ({
    next,
    ctx,
    type,
    path,
    input,
    rawInput
  }: {
    next: () => Promise<any>;
    ctx: TContext;
    type: string;
    path: string;
    input: { [name: string]: any };
    rawInput: unknown;
  }) => {
    const opWithPath: Array<string> = path.split(".");
    const opName: string = opWithPath[opWithPath.length - 1]!;
    const keys = Object.keys(ruleTree);
    let rule: ShieldRule<TContext> | undefined;
    if (keys.includes("query") || keys.includes("mutation")) {
      // @ts-ignore
      rule = ruleTree?.[type]?.[opName];
    } else {
      const namespace = opWithPath[0];

      const tree = (ruleTree as Record<string, any>)[namespace!];
      if (tree?.[type]?.[opName]) {
        rule = tree?.[type]?.[opName];
      }
    }
    rule = rule ?? options.fallbackRule;

    if (rule) {
      return rule
        ?.resolve(ctx, type, path, input, rawInput, options)
        .then(async result => {
          if (result instanceof Error) {
            throw result;
          }
          if (!result) {
            throw options.fallbackError;
          }

          return next();
        });
    }

    return next();
  };
}
