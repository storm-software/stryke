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
  LogicRuleInterface,
  OptionsInterface,
  RuleFunctionInterface,
  RuleInterface,
  RuleResultInterface,
  ShieldRule
} from "./types";

export class Rule<
  TContext extends Record<string, any>
> implements RuleInterface<TContext> {
  readonly name: string;

  func?: RuleFunctionInterface<TContext>;

  constructor(name: string, func?: RuleFunctionInterface<TContext>) {
    this.name = name;
    this.func = func;
  }

  async resolve(
    ctx: TContext,
    type: string,
    path: string,
    input: { [name: string]: any },
    rawInput: unknown,
    options: OptionsInterface<TContext>
  ): Promise<RuleResultInterface> {
    try {
      /* Resolve */
      const res = await this.executeRule(
        ctx,
        type,
        path,
        input,
        rawInput,
        options
      );

      if (res instanceof Error) {
        return res;
      } else if (typeof res === "string") {
        return new Error(res);
      } else if (res === true) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      if (options.debug) {
        throw err;
      } else {
        return false;
      }
    }
  }

  /**
   *
   * Compares a given rule with the current one
   * and checks whether their functions are equal.
   *
   */
  equals(rule: Rule<TContext>): boolean {
    return this.func === rule.func;
  }

  executeRule<TContext extends Record<string, any>>(
    ctx: TContext,
    type: string,
    path: string,
    input: { [name: string]: any },
    rawInput: unknown,
    options: OptionsInterface<TContext>
  ): string | boolean | Error | Promise<RuleResultInterface> {
    // @ts-ignore
    return this.func(ctx, type, path, input, rawInput, options);
  }
}

export class LogicRule<TContext extends Record<string, any>>
  extends Rule<TContext>
  implements LogicRuleInterface<TContext>
{
  private rules: ShieldRule<TContext>[];

  constructor(rules: ShieldRule<TContext>[]) {
    super("LogicRule");

    this.rules = rules;
  }

  /**
   * By default logic rule resolves to false.
   */
  override async resolve(
    _ctx: TContext,
    _type: string,
    _path: string,
    _input: { [name: string]: any },
    _rawInput: unknown,
    _options: OptionsInterface<TContext>
  ): Promise<RuleResultInterface> {
    return false;
  }

  /**
   * Evaluates all the rules.
   */
  async evaluate(
    ctx: TContext,
    type: string,
    path: string,
    input: { [name: string]: any },
    rawInput: unknown,
    options: OptionsInterface<TContext>
  ): Promise<RuleResultInterface[]> {
    const rules = this.getRules();
    const tasks = rules.map(async rule =>
      rule.resolve(ctx, type, path, input, rawInput, options)
    );

    return Promise.all(tasks);
  }

  /**
   * Returns rules in a logic rule.
   */
  getRules() {
    return this.rules;
  }
}

// Extended Types

export class RuleOr<
  TContext extends Record<string, any>
> extends LogicRule<TContext> {
  constructor(rules: ShieldRule<TContext>[]) {
    super(rules);
  }

  /**
   * Makes sure that at least one of them has evaluated to true.
   */
  override async resolve(
    ctx: TContext,
    type: string,
    path: string,
    input: { [name: string]: any },
    rawInput: unknown,
    options: OptionsInterface<TContext>
  ): Promise<RuleResultInterface> {
    const result = await this.evaluate(
      ctx,
      type,
      path,
      input,
      rawInput,
      options
    );

    if (result.every(res => res !== true)) {
      const customError = result.find(res => res instanceof Error);

      return customError ?? false;
    } else {
      return true;
    }
  }
}

export class RuleAnd<
  TContext extends Record<string, any>
> extends LogicRule<TContext> {
  constructor(rules: ShieldRule<TContext>[]) {
    super(rules);
  }

  /**
   * Makes sure that all of them have resolved to true.
   */
  override async resolve(
    ctx: TContext,
    type: string,
    path: string,
    input: { [name: string]: any },
    rawInput: unknown,
    options: OptionsInterface<TContext>
  ): Promise<RuleResultInterface> {
    const result = await this.evaluate(
      ctx,
      type,
      path,
      input,
      rawInput,
      options
    );

    if (result.some(res => res !== true)) {
      const customError = result.find(res => res instanceof Error);

      return customError ?? false;
    } else {
      return true;
    }
  }
}

export class RuleChain<
  TContext extends Record<string, any>
> extends LogicRule<TContext> {
  constructor(rules: ShieldRule<TContext>[]) {
    super(rules);
  }

  /**
   * Makes sure that all of them have resolved to true.
   */
  override async resolve(
    ctx: TContext,
    type: string,
    path: string,
    input: { [name: string]: any },
    rawInput: unknown,
    options: OptionsInterface<TContext>
  ): Promise<RuleResultInterface> {
    const result = await this.evaluate(
      ctx,
      type,
      path,
      input,
      rawInput,
      options
    );

    if (result.some(res => res !== true)) {
      const customError = result.find(res => res instanceof Error);

      return customError ?? false;
    } else {
      return true;
    }
  }

  /**
   * Evaluates all the rules.
   */
  override async evaluate(
    ctx: TContext,
    type: string,
    path: string,
    input: { [name: string]: any },
    rawInput: unknown,
    options: OptionsInterface<TContext>
  ): Promise<RuleResultInterface[]> {
    const rules = this.getRules();

    return iterate(rules);

    async function iterate([
      rule,
      ...otherRules
    ]: ShieldRule<TContext>[]): Promise<RuleResultInterface[]> {
      if (rule === undefined) return [];
      return rule
        .resolve(ctx, type, path, input, rawInput, options)
        .then(async res => {
          if (res !== true) {
            return [res];
          } else {
            return iterate(otherRules).then(ress => ress.concat(res));
          }
        });
    }
  }
}

export class RuleRace<
  TContext extends Record<string, any>
> extends LogicRule<TContext> {
  constructor(rules: ShieldRule<TContext>[]) {
    super(rules);
  }

  /**
   * Makes sure that at least one of them resolved to true.
   */
  override async resolve(
    ctx: TContext,
    type: string,
    path: string,
    input: { [name: string]: any },
    rawInput: unknown,
    options: OptionsInterface<TContext>
  ): Promise<RuleResultInterface> {
    const result = await this.evaluate(
      ctx,
      type,
      path,
      input,
      rawInput,
      options
    );

    if (result.includes(true)) {
      return true;
    } else {
      const customError = result.find(res => res instanceof Error);

      return customError ?? false;
    }
  }

  /**
   * Evaluates all the rules.
   */
  override async evaluate(
    ctx: TContext,
    type: string,
    path: string,
    input: { [name: string]: any },
    rawInput: unknown,
    options: OptionsInterface<TContext>
  ): Promise<RuleResultInterface[]> {
    const rules = this.getRules();

    return iterate(rules);

    async function iterate([
      rule,
      ...otherRules
    ]: ShieldRule<TContext>[]): Promise<RuleResultInterface[]> {
      if (rule === undefined) return [];
      return rule
        .resolve(ctx, type, path, input, rawInput, options)
        .then(async res => {
          if (res === true) {
            return [res];
          } else {
            return iterate(otherRules).then(ress => ress.concat(res));
          }
        });
    }
  }
}

export class RuleNot<TContext extends Record<string, any>>
  extends LogicRule<TContext>
  implements LogicRuleInterface<TContext>
{
  error?: Error;

  override name: string = "RuleNot";

  override equals!: (rule: RuleInterface<TContext>) => boolean;

  constructor(rule: ShieldRule<TContext>, error?: Error) {
    super([rule]);
    this.error = error;
  }

  /**
   * Negates the result.
   */
  override async resolve(
    ctx: TContext,
    type: string,
    path: string,
    input: { [name: string]: any },
    rawInput: unknown,
    options: OptionsInterface<TContext>
  ): Promise<RuleResultInterface> {
    const [res] = await this.evaluate(
      ctx,
      type,
      path,
      input,
      rawInput,
      options
    );

    if (res instanceof Error) {
      return true;
    } else if (res !== true) {
      return true;
    } else {
      if (this.error) return this.error;
      return false;
    }
  }
}

export class RuleTrue<TContext extends Record<string, any>>
  extends LogicRule<TContext>
  implements LogicRuleInterface<TContext>
{
  override name: string = "RuleTrue";

  override equals!: (rule: RuleInterface<TContext>) => boolean;

  constructor() {
    super([]);
  }

  /**
   *
   * Always true.
   *
   */
  override async resolve(): Promise<RuleResultInterface> {
    return true;
  }
}

export class RuleFalse<TContext extends Record<string, any>>
  extends LogicRule<TContext>
  implements LogicRuleInterface<TContext>
{
  override name: string = "RuleTrue";

  override equals!: (rule: RuleInterface<TContext>) => boolean;

  constructor() {
    super([]);
  }

  /**
   *
   * Always false.
   *
   */
  override async resolve(): Promise<RuleResultInterface> {
    return false;
  }
}
