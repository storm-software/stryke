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

export type ShieldRule<
  TContext extends Record<string, any> = Record<string, any>
> = IRule<TContext> | ILogicRule<TContext>;

export interface IRule<
  TContext extends Record<string, any> = Record<string, any>
> {
  name: string;
  equals: (rule: IRule<TContext>) => boolean;
  resolve: (
    ctx: TContext,
    type: string,
    path: string,
    input: { [name: string]: any },
    rawInput: unknown,
    options: IOptions<TContext>
  ) => Promise<IRuleResult>;
  executeRule: <TContext extends Record<string, any>>(
    ctx: TContext,
    type: string,
    path: string,
    input: { [name: string]: any },
    rawInput: unknown,
    options: IOptions<TContext>
  ) => string | boolean | Error | Promise<IRuleResult>;
}

export interface IRuleOptions {}

export interface ILogicRule<
  TContext extends Record<string, any> = Record<string, any>
> extends IRule<TContext> {
  getRules: () => ShieldRule<TContext>[];
  evaluate: (
    ctx: TContext,
    type: string,
    path: string,
    input: { [name: string]: any },
    rawInput: unknown,
    options: IOptions<TContext>
  ) => Promise<IRuleResult[]>;
  resolve: (
    ctx: TContext,
    type: string,
    path: string,
    input: { [name: string]: any },
    rawInput: unknown,
    options: IOptions<TContext>
  ) => Promise<IRuleResult>;
}

export type IRuleResult = boolean | string | Error;
export type IRuleFunction<
  TContext extends Record<string, any> = Record<string, any>
> = (
  ctx: TContext,
  type: string,
  path: string,
  input: { [name: string]: any },
  rawInput: unknown,
  options: IOptions<TContext>
) => IRuleResult | Promise<IRuleResult>;

export interface IRuleConstructorOptions {}

// Rules Definition Tree

export interface IRuleTypeMap<
  TContext extends Record<string, any> = Record<string, any>
> {
  [key: string]:
    | ShieldRule<TContext>
    | IRuleFieldMap<TContext>
    | IRuleTypeMap<TContext>;
}

export interface IRuleFieldMap<
  TContext extends Record<string, any> = Record<string, any>
> {
  [key: string]: ShieldRule<TContext>;
}

export type IRules<TContext extends Record<string, any> = Record<string, any>> =
  ShieldRule<TContext> | IRuleTypeMap<TContext>;

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

export interface IOptions<
  TContext extends Record<string, any> = Record<string, any>
> {
  debug: boolean;
  allowExternalErrors: boolean;
  fallbackRule: ShieldRule<TContext>;
  fallbackError?: IFallbackErrorType<TContext>;
}

export interface IOptionsConstructor<
  TContext extends Record<string, any> = Record<string, any>
> {
  debug?: boolean;
  allowExternalErrors?: boolean;
  fallbackRule?: ShieldRule<TContext>;
  fallbackError?: string | IFallbackErrorType<TContext>;
}

export declare function shield<
  TContext extends Record<string, any> = Record<string, any>
>(ruleTree: IRules<TContext>, options: IOptions<TContext>): any;
