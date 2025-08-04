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

export type ShieldRule<
  TContext extends Record<string, any> = Record<string, any>
> = RuleInterface<TContext> | LogicRuleInterface<TContext>;

export interface RuleInterface<
  TContext extends Record<string, any> = Record<string, any>
> {
  name: string;
  equals: (rule: RuleInterface<TContext>) => boolean;
  resolve: (
    ctx: TContext,
    type: string,
    path: string,
    input: { [name: string]: any },
    rawInput: unknown,
    options: OptionsInterface<TContext>
  ) => Promise<RuleResultInterface>;
  executeRule: <TContext extends Record<string, any>>(
    ctx: TContext,
    type: string,
    path: string,
    input: { [name: string]: any },
    rawInput: unknown,
    options: OptionsInterface<TContext>
  ) => string | boolean | Error | Promise<RuleResultInterface>;
}

export interface RuleOptionsInterface {}

export interface LogicRuleInterface<
  TContext extends Record<string, any> = Record<string, any>
> extends RuleInterface<TContext> {
  getRules: () => ShieldRule<TContext>[];
  evaluate: (
    ctx: TContext,
    type: string,
    path: string,
    input: { [name: string]: any },
    rawInput: unknown,
    options: OptionsInterface<TContext>
  ) => Promise<RuleResultInterface[]>;
  resolve: (
    ctx: TContext,
    type: string,
    path: string,
    input: { [name: string]: any },
    rawInput: unknown,
    options: OptionsInterface<TContext>
  ) => Promise<RuleResultInterface>;
}

export type RuleResultInterface = boolean | string | Error;
export type RuleFunctionInterface<
  TContext extends Record<string, any> = Record<string, any>
> = (
  ctx: TContext,
  type: string,
  path: string,
  input: { [name: string]: any },
  rawInput: unknown,
  options: OptionsInterface<TContext>
) => RuleResultInterface | Promise<RuleResultInterface>;

export interface RuleConstructorOptionsInterface {}

// Rules Definition Tree

export interface RuleTypeMapInterface<
  TContext extends Record<string, any> = Record<string, any>
> {
  [key: string]:
    | ShieldRule<TContext>
    | RuleFieldMapInterface<TContext>
    | RuleTypeMapInterface<TContext>;
}

export interface RuleFieldMapInterface<
  TContext extends Record<string, any> = Record<string, any>
> {
  [key: string]: ShieldRule<TContext>;
}

export type IRules<TContext extends Record<string, any> = Record<string, any>> =
  ShieldRule<TContext> | RuleTypeMapInterface<TContext>;

export type IFallbackErrorMapperType<
  TContext extends Record<string, any> = Record<string, any>
> = (
  err: unknown,
  ctx: TContext,
  type: string,
  path: string,
  input: { [name: string]: any },
  rawInput: unknown
) => Promise<Error> | Error;

export type IFallbackErrorType<
  TContext extends Record<string, any> = Record<string, any>
> = Error | IFallbackErrorMapperType<TContext>;

// Generator Options

export interface OptionsInterface<
  TContext extends Record<string, any> = Record<string, any>
> {
  debug: boolean;
  allowExternalErrors: boolean;
  fallbackRule: ShieldRule<TContext>;
  fallbackError?: IFallbackErrorType<TContext>;
}

export interface OptionsConstructorInterface<
  TContext extends Record<string, any> = Record<string, any>
> {
  debug?: boolean;
  allowExternalErrors?: boolean;
  fallbackRule?: ShieldRule<TContext>;
  fallbackError?: string | IFallbackErrorType<TContext>;
}

export declare function shield<
  TContext extends Record<string, any> = Record<string, any>
>(ruleTree: IRules<TContext>, options: OptionsInterface<TContext>): any;
