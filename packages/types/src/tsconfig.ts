/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/license.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://docs.stormsoftware.com/projects/stryke
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import type { FilterPattern } from "./file";

export type JSX =
  | "preserve"
  | "react"
  | "react-jsx"
  | "react-jsxdev"
  | "react-native";

export type Module =
  | "CommonJS"
  | "AMD"
  | "System"
  | "UMD"
  | "ES6"
  | "ES2015"
  | "ES2020"
  | "ES2022"
  | "ESNext"
  | "Node16"
  | "NodeNext"
  | "Preserve"
  | "None"
  // Lowercase alternatives
  | "commonjs"
  | "amd"
  | "system"
  | "umd"
  | "es6"
  | "es2015"
  | "es2020"
  | "es2022"
  | "esnext"
  | "node16"
  | "nodenext"
  | "preserve"
  | "none";

export type NewLine =
  | "CRLF"
  | "LF"
  // Lowercase alternatives
  | "crlf"
  | "lf";

export type Target =
  | "ES3"
  | "ES5"
  | "ES6"
  | "ES2015"
  | "ES2016"
  | "ES2017"
  | "ES2018"
  | "ES2019"
  | "ES2020"
  | "ES2021"
  | "ES2022"
  | "ESNext"
  // Lowercase alternatives
  | "es3"
  | "es5"
  | "es6"
  | "es2015"
  | "es2016"
  | "es2017"
  | "es2018"
  | "es2019"
  | "es2020"
  | "es2021"
  | "es2022"
  | "esnext";

export type Lib =
  | "ES5"
  | "ES6"
  | "ES7"
  | "ES2015"
  | "ES2015.Collection"
  | "ES2015.Core"
  | "ES2015.Generator"
  | "ES2015.Iterable"
  | "ES2015.Promise"
  | "ES2015.Proxy"
  | "ES2015.Reflect"
  | "ES2015.Symbol.WellKnown"
  | "ES2015.Symbol"
  | "ES2016"
  | "ES2016.Array.Include"
  | "ES2017"
  | "ES2017.Intl"
  | "ES2017.Object"
  | "ES2017.SharedMemory"
  | "ES2017.String"
  | "ES2017.TypedArrays"
  | "ES2018"
  | "ES2018.AsyncGenerator"
  | "ES2018.AsyncIterable"
  | "ES2018.Intl"
  | "ES2018.Promise"
  | "ES2018.Regexp"
  | "ES2019"
  | "ES2019.Array"
  | "ES2019.Object"
  | "ES2019.String"
  | "ES2019.Symbol"
  | "ES2020"
  | "ES2020.BigInt"
  | "ES2020.Promise"
  | "ES2020.String"
  | "ES2020.Symbol.WellKnown"
  | "ES2020.SharedMemory"
  | "ES2020.Intl"
  | "ES2021"
  | "ES2021.Promise"
  | "ES2021.String"
  | "ES2021.WeakRef"
  | "ES2022"
  | "ES2022.Array"
  | "ES2022.Error"
  | "ES2022.Intl"
  | "ES2022.Object"
  | "ES2022.SharedMemory"
  | "ES2022.String"
  | "ES2022.RegExp"
  | "ESNext"
  | "ESNext.Array"
  | "ESNext.AsyncIterable"
  | "ESNext.BigInt"
  | "ESNext.Intl"
  | "ESNext.Promise"
  | "ESNext.String"
  | "ESNext.Symbol"
  | "ESNext.WeakRef"
  | "DOM"
  | "DOM.Iterable"
  | "ScriptHost"
  | "WebWorker"
  | "WebWorker.ImportScripts"
  | "WebWorker.Iterable"
  // Lowercase alternatives
  | "es5"
  | "es6"
  | "es7"
  | "es2015"
  | "es2015.collection"
  | "es2015.core"
  | "es2015.generator"
  | "es2015.iterable"
  | "es2015.promise"
  | "es2015.proxy"
  | "es2015.reflect"
  | "es2015.symbol.wellknown"
  | "es2015.symbol"
  | "es2016"
  | "es2016.array.include"
  | "es2017"
  | "es2017.intl"
  | "es2017.object"
  | "es2017.sharedmemory"
  | "es2017.string"
  | "es2017.typedarrays"
  | "es2018"
  | "es2018.asyncgenerator"
  | "es2018.asynciterable"
  | "es2018.intl"
  | "es2018.promise"
  | "es2018.regexp"
  | "es2019"
  | "es2019.array"
  | "es2019.object"
  | "es2019.string"
  | "es2019.symbol"
  | "es2020"
  | "es2020.bigint"
  | "es2020.promise"
  | "es2020.string"
  | "es2020.symbol.wellknown"
  | "es2020.sharedmemory"
  | "es2020.intl"
  | "es2021"
  | "es2021.promise"
  | "es2021.string"
  | "es2021.weakref"
  | "es2022"
  | "es2022.array"
  | "es2022.error"
  | "es2022.intl"
  | "es2022.object"
  | "es2022.sharedmemory"
  | "es2022.string"
  | "es2022.regexp"
  | "esnext"
  | "esnext.array"
  | "esnext.asynciterable"
  | "esnext.bigint"
  | "esnext.intl"
  | "esnext.promise"
  | "esnext.string"
  | "esnext.symbol"
  | "esnext.weakref"
  | "dom"
  | "dom.iterable"
  | "scripthost"
  | "webworker"
  | "webworker.importscripts"
  | "webworker.iterable";

export interface Plugin {
  /**
   * Plugin name.
   */
  name: string;
}

export type ImportsNotUsedAsValues = "remove" | "preserve" | "error";

export type FallbackPolling =
  | "fixedPollingInterval"
  | "priorityPollingInterval"
  | "dynamicPriorityPolling"
  | "fixedInterval"
  | "priorityInterval"
  | "dynamicPriority"
  | "fixedChunkSize";

export type WatchDirectory =
  | "useFsEvents"
  | "fixedPollingInterval"
  | "dynamicPriorityPolling"
  | "fixedChunkSizePolling";

export type WatchFile =
  | "fixedPollingInterval"
  | "priorityPollingInterval"
  | "dynamicPriorityPolling"
  | "useFsEvents"
  | "useFsEventsOnParentDirectory"
  | "fixedChunkSizePolling";

export type ModuleResolution =
  | "classic"
  | "node"
  | "node10"
  | "node16"
  | "nodenext"
  | "bundler"
  // Pascal-cased alternatives
  | "Classic"
  | "Node"
  | "Node10"
  | "Node16"
  | "NodeNext"
  | "Bundler";

export type ModuleDetection = "auto" | "legacy" | "force";

export type IgnoreDeprecations = "5.0";

export interface CompilerOptions {
  /**
   * The character set of the input files.
   *
   * @defaultValue 'utf8'
   * @deprecated This option will be removed in TypeScript 5.5.
   */
  charset?: string;

  /**
   * Enables building for project references.
   *
   * @defaultValue true
   */
  composite?: boolean;

  /**
   * Generates corresponding d.ts files.
   *
   * @defaultValue false
   */
  declaration?: boolean;

  /**
   * Specify output directory for generated declaration files.
   */
  declarationDir?: string;

  /**
   * Show diagnostic information.
   *
   * @defaultValue false
   */
  diagnostics?: boolean;

  /**
   * Reduce the number of projects loaded automatically by TypeScript.
   *
   * @defaultValue false
   */
  disableReferencedProjectLoad?: boolean;

  /**
   * Enforces using indexed accessors for keys declared using an indexed type.
   *
   * @defaultValue false
   */
  noPropertyAccessFromIndexSignature?: boolean;

  /**
   * Emit a UTF-8 Byte Order Mark (BOM) in the beginning of output files.
   *
   * @defaultValue false
   */
  emitBOM?: boolean;

  /**
   * Only emit `.d.ts` declaration files.
   *
   * @defaultValue false
   */
  emitDeclarationOnly?: boolean;

  /**
   * Differentiate between undefined and not present when type checking.
   *
   * @defaultValue false
   */
  exactOptionalPropertyTypes?: boolean;

  /**
   * Enable incremental compilation.
   *
   * @defaultValue `composite`
   */
  incremental?: boolean;

  /**
   * Specify file to store incremental compilation information.
   *
   * @defaultValue '.tsbuildinfo'
   */
  tsBuildInfoFile?: string;

  /**
   * Emit a single file with source maps instead of having a separate file.
   *
   * @defaultValue false
   */
  inlineSourceMap?: boolean;

  /**
   * Emit the source alongside the sourcemaps within a single file.
   *
   * Requires `--inlineSourceMap` to be set.
   *
   * @defaultValue false
   */
  inlineSources?: boolean;

  /**
   * Specify what JSX code is generated.
   *
   * @defaultValue 'preserve'
   */
  jsx?: JSX;

  /**
   * Specifies the object invoked for `createElement` and `__spread` when targeting `'react'` JSX emit.
   *
   * @defaultValue 'React'
   */
  reactNamespace?: string;

  /**
   * Specify the JSX factory function to use when targeting React JSX emit, e.g. `React.createElement` or `h`.
   *
   * @defaultValue 'React.createElement'
   */
  jsxFactory?: string;

  /**
   * Specify the JSX Fragment reference used for fragments when targeting React JSX emit e.g. 'React.Fragment' or 'Fragment'.
   *
   * @defaultValue 'React.Fragment'
   */
  jsxFragmentFactory?: string;

  /**
   * Specify module specifier used to import the JSX factory functions when using `jsx: react-jsx*`.
   *
   * @defaultValue 'react'
   */
  jsxImportSource?: string;

  /**
   * Print names of files part of the compilation.
   *
   * @defaultValue false
   */
  listFiles?: boolean;

  /**
   * Specifies the location where debugger should locate map files instead of generated locations.
   */
  mapRoot?: string;

  /**
   * Specify module code generation: 'None', 'CommonJS', 'AMD', 'System', 'UMD', 'ES6', 'ES2015' or 'ESNext'. Only 'AMD' and 'System' can be used in conjunction with `--outFile`. 'ES6' and 'ES2015' values may be used when targeting 'ES5' or lower.
   *
   * @defaultValue ['ES3', 'ES5'].includes(target) ? 'CommonJS' : 'ES6'
   */
  module?: Module;

  /**
   * Specifies module resolution strategy: 'node' (Node) or 'classic' (TypeScript pre 1.6).
   *
   * @defaultValue ['AMD', 'System', 'ES6'].includes(module) ? 'classic' : 'node'
   */
  moduleResolution?: ModuleResolution;

  /**
   * Specifies the end of line sequence to be used when emitting files: 'crlf' (Windows) or 'lf' (Unix).
   *
   * @defaultValue 'LF'
   */
  newLine?: NewLine;

  /**
   * Do not emit output.
   *
   * @defaultValue false
   */
  noEmit?: boolean;

  /**
   * Do not generate custom helper functions like `__extends` in compiled output.
   *
   * @defaultValue false
   */
  noEmitHelpers?: boolean;

  /**
   * Do not emit outputs if any type checking errors were reported.
   *
   * @defaultValue false
   */
  noEmitOnError?: boolean;

  /**
   * Warn on expressions and declarations with an implied 'any' type.
   *
   * @defaultValue false
   */
  noImplicitAny?: boolean;

  /**
   * Raise error on 'this' expressions with an implied any type.
   *
   * @defaultValue false
   */
  noImplicitThis?: boolean;

  /**
   * Report errors on unused locals.
   *
   * @defaultValue false
   */
  noUnusedLocals?: boolean;

  /**
   * Report errors on unused parameters.
   *
   * @defaultValue false
   */
  noUnusedParameters?: boolean;

  /**
   * Do not include the default library file (lib.d.ts).
   *
   * @defaultValue false
   */
  noLib?: boolean;

  /**
   * Do not add triple-slash references or module import targets to the list of compiled files.
   *
   * @defaultValue false
   */
  noResolve?: boolean;

  /**
   * Disable strict checking of generic signatures in function types.
   *
   * @defaultValue false
   * @deprecated This option will be removed in TypeScript 5.5.
   */
  noStrictGenericChecks?: boolean;

  /**
   * @deprecated use `skipLibCheck` instead.
   */
  skipDefaultLibCheck?: boolean;

  /**
   * Skip type checking of declaration files.
   *
   * @defaultValue false
   */
  skipLibCheck?: boolean;

  /**
   * Concatenate and emit output to single file.
   */
  outFile?: string;

  /**
   * Redirect output structure to the directory.
   */
  outDir?: string;

  /**
   * Do not erase const enum declarations in generated code.
   *
   * @defaultValue false
   */
  preserveConstEnums?: boolean;

  /**
   * Do not resolve symlinks to their real path; treat a symlinked file like a real one.
   *
   * @defaultValue false
   */
  preserveSymlinks?: boolean;

  /**
   * Keep outdated console output in watch mode instead of clearing the screen.
   *
   * @defaultValue false
   */
  preserveWatchOutput?: boolean;

  /**
   * Stylize errors and messages using color and context (experimental).
   *
   * @defaultValue true // Unless piping to another program or redirecting output to a file.
   */
  pretty?: boolean;

  /**
   * Do not emit comments to output.
   *
   * @defaultValue false
   */
  removeComments?: boolean;

  /**
   * Specifies the root directory of input files.
   *
   * Use to control the output directory structure with `--outDir`.
   */
  rootDir?: string;

  /**
   * Unconditionally emit imports for unresolved files.
   *
   * @defaultValue false
   */
  isolatedModules?: boolean;

  /**
   * Generates corresponding '.map' file.
   *
   * @defaultValue false
   */
  sourceMap?: boolean;

  /**
   * Specifies the location where debugger should locate TypeScript files instead of source locations.
   */
  sourceRoot?: string;

  /**
   * Suppress excess property checks for object literals.
   *
   * @defaultValue false
   * @deprecated This option will be removed in TypeScript 5.5.
   */
  suppressExcessPropertyErrors?: boolean;

  /**
   * Suppress noImplicitAny errors for indexing objects lacking index signatures.
   *
   * @defaultValue false
   * @deprecated This option will be removed in TypeScript 5.5.
   */
  suppressImplicitAnyIndexErrors?: boolean;

  /**
   * Do not emit declarations for code that has an `@internal` annotation.
   */
  stripInternal?: boolean;

  /**
   * Specify ECMAScript target version.
   *
   * @defaultValue 'es3'
   */
  target?: Target;

  /**
   * Default catch clause variables as `unknown` instead of `any`.
   *
   * @defaultValue false
   */
  useUnknownInCatchVariables?: boolean;

  /**
   * Watch input files.
   *
   * @defaultValue false
   * @deprecated Use watchOptions instead.
   */
  watch?: boolean;

  /**
   * Specify the polling strategy to use when the system runs out of or doesn't support native file watchers.
   *
   * @deprecated Use watchOptions.fallbackPolling instead.
   */
  fallbackPolling?: FallbackPolling;

  /**
   * Specify the strategy for watching directories under systems that lack recursive file-watching functionality.
   *
   * @defaultValue 'useFsEvents'
   * @deprecated Use watchOptions.watchDirectory instead.
   */
  watchDirectory?: WatchDirectory;

  /**
   * Specify the strategy for watching individual files.
   *
   * @defaultValue 'useFsEvents'
   * @deprecated Use watchOptions.watchFile instead.
   */
  watchFile?: WatchFile;

  /**
   * Enables experimental support for ES7 decorators.
   *
   * @defaultValue false
   */
  experimentalDecorators?: boolean;

  /**
   * Emit design-type metadata for decorated declarations in source.
   *
   * @defaultValue false
   */
  emitDecoratorMetadata?: boolean;

  /**
   * Do not report errors on unused labels.
   *
   * @defaultValue false
   */
  allowUnusedLabels?: boolean;

  /**
   * Report error when not all code paths in function return a value.
   *
   * @defaultValue false
   */
  noImplicitReturns?: boolean;

  /**
   * Add `undefined` to a type when accessed using an index.
   *
   * @defaultValue false
   */
  noUncheckedIndexedAccess?: boolean;

  /**
   * Report errors for fallthrough cases in switch statement.
   *
   * @defaultValue false
   */
  noFallthroughCasesInSwitch?: boolean;

  /**
   * Ensure overriding members in derived classes are marked with an override modifier.
   *
   * @defaultValue false
   */
  noImplicitOverride?: boolean;

  /**
   * Do not report errors on unreachable code.
   *
   * @defaultValue false
   */
  allowUnreachableCode?: boolean;

  /**
   * Disallow inconsistently-cased references to the same file.
   *
   * @defaultValue true
   */
  forceConsistentCasingInFileNames?: boolean;

  /**
   * Emit a v8 CPU profile of the compiler run for debugging.
   *
   * @defaultValue 'profile.cpuprofile'
   */
  generateCpuProfile?: string;

  /**
   * Base directory to resolve non-relative module names.
   */
  baseUrl?: string;

  /**
   * Specify path mapping to be computed relative to baseUrl option.
   */
  paths?: Record<string, string[]>;

  /**
   * List of TypeScript language server plugins to load.
   */
  plugins?: Plugin[];

  /**
   * Specify list of root directories to be used when resolving modules.
   */
  rootDirs?: string[];

  /**
   * Specify list of directories for type definition files to be included.
   */
  typeRoots?: string[];

  /**
   * Type declaration files to be included in compilation.
   */
  types?: string[];

  /**
   * Enable tracing of the name resolution process.
   *
   * @defaultValue false
   */
  traceResolution?: boolean;

  /**
   * Allow javascript files to be compiled.
   *
   * @defaultValue false
   */
  allowJs?: boolean;

  /**
   * Do not truncate error messages.
   *
   * @defaultValue false
   */
  noErrorTruncation?: boolean;

  /**
   * Allow default imports from modules with no default export. This does not affect code emit, just typechecking.
   *
   * @defaultValue module === 'system' || esModuleInterop
   */
  allowSyntheticDefaultImports?: boolean;

  /**
   * Do not emit `'use strict'` directives in module output.
   *
   * @defaultValue false
   * @deprecated This option will be removed in TypeScript 5.5.
   */
  noImplicitUseStrict?: boolean;

  /**
   * Enable to list all emitted files.
   *
   * @defaultValue false
   */
  listEmittedFiles?: boolean;

  /**
   * Disable size limit for JavaScript project.
   *
   * @defaultValue false
   */
  disableSizeLimit?: boolean;

  /**
   * List of library files to be included in the compilation.
   */
  lib?: Lib[];

  /**
   * Enable strict null checks.
   *
   * @defaultValue false
   */
  strictNullChecks?: boolean;

  /**
   * The maximum dependency depth to search under `node_modules` and load JavaScript files. Only applicable with `--allowJs`.
   *
   * @defaultValue 0
   */
  maxNodeModuleJsDepth?: number;

  /**
   * Import emit helpers (e.g. `__extends`, `__rest`, etc..) from tslib.
   *
   * @defaultValue false
   */
  importHelpers?: boolean;

  /**
   * Specify emit/checking behavior for imports that are only used for types.
   *
   * @defaultValue 'remove'
   * @deprecated Use `verbatimModuleSyntax` instead.
   */
  importsNotUsedAsValues?: ImportsNotUsedAsValues;

  /**
   * Parse in strict mode and emit `'use strict'` for each source file.
   *
   * @defaultValue false
   */
  alwaysStrict?: boolean;

  /**
   * Enable all strict type checking options.
   *
   * @defaultValue false
   */
  strict?: boolean;

  /**
   * Enable stricter checking of of the `bind`, `call`, and `apply` methods on functions.
   *
   * @defaultValue false
   */
  strictBindCallApply?: boolean;

  /**
   * Provide full support for iterables in `for-of`, spread, and destructuring when targeting `ES5` or `ES3`.
   *
   * @defaultValue false
   */
  downlevelIteration?: boolean;

  /**
   * Report errors in `.js` files.
   *
   * @defaultValue false
   */
  checkJs?: boolean;

  /**
   * Disable bivariant parameter checking for function types.
   *
   * @defaultValue false
   */
  strictFunctionTypes?: boolean;

  /**
   * Ensure non-undefined class properties are initialized in the constructor.
   *
   * @defaultValue false
   */
  strictPropertyInitialization?: boolean;

  /**
   * Emit `__importStar` and `__importDefault` helpers for runtime Babel ecosystem compatibility and enable `--allowSyntheticDefaultImports` for typesystem compatibility.
   *
   * @defaultValue false
   */
  esModuleInterop?: boolean;

  /**
   * Allow accessing UMD globals from modules.
   *
   * @defaultValue false
   */
  allowUmdGlobalAccess?: boolean;

  /**
   * Resolve `keyof` to string valued property names only (no numbers or symbols).
   *
   * @defaultValue false
   * @deprecated This option will be removed in TypeScript 5.5.
   */
  keyofStringsOnly?: boolean;

  /**
   * Emit ECMAScript standard class fields.
   *
   * @defaultValue false
   */
  useDefineForClassFields?: boolean;

  /**
   * Generates a sourcemap for each corresponding `.d.ts` file.
   *
   * @defaultValue false
   */
  declarationMap?: boolean;

  /**
   * Include modules imported with `.json` extension.
   *
   * @defaultValue false
   */
  resolveJsonModule?: boolean;

  /**
   * Have recompiles in '--incremental' and '--watch' assume that changes within a file will only affect files directly depending on it.
   *
   * @defaultValue false
   */
  assumeChangesOnlyAffectDirectDependencies?: boolean;

  /**
   * Output more detailed compiler performance information after building.
   *
   * @defaultValue false
   */
  extendedDiagnostics?: boolean;

  /**
   * Print names of files that are part of the compilation and then stop processing.
   *
   * @defaultValue false
   */
  listFilesOnly?: boolean;

  /**
   * Disable preferring source files instead of declaration files when referencing composite projects.
   *
   * @defaultValue true if composite, false otherwise
   */
  disableSourceOfProjectReferenceRedirect?: boolean;

  /**
   * Opt a project out of multi-project reference checking when editing.
   *
   * @defaultValue false
   */
  disableSolutionSearching?: boolean;

  /**
   * Print names of files which TypeScript sees as a part of your project and the reason they are part of the compilation.
   *
   * @defaultValue false
   */
  explainFiles?: boolean;

  /**
   * Preserve unused imported values in the JavaScript output that would otherwise be removed.
   *
   * @defaultValue true
   * @deprecated Use `verbatimModuleSyntax` instead.
   */
  preserveValueImports?: boolean;

  /**
   * List of file name suffixes to search when resolving a module.
   */
  moduleSuffixes?: string[];

  /**
   * Control what method is used to detect module-format JS files.
   *
   * @defaultValue 'auto'
   */
  moduleDetection?: ModuleDetection;

  /**
   * Allows TypeScript files to import each other with a TypeScript-specific extension like .ts, .mts, or .tsx.
   *
   * @defaultValue false
   */
  allowImportingTsExtensions?: boolean;

  /**
   * Forces TypeScript to consult the exports field of package.json files if it ever reads from a package in node_modules.
   *
   * @defaultValue false
   */
  resolvePackageJsonExports?: boolean;

  /**
   * Forces TypeScript to consult the imports field of package.json files when performing a lookup that starts with # from a file whose ancestor directory contains a package.json.
   *
   * @defaultValue false
   */
  resolvePackageJsonImports?: boolean;

  /**
   * Suppress errors for file formats that TypeScript does not understand.
   *
   * @defaultValue false
   */
  allowArbitraryExtensions?: boolean;

  /**
   * List of additional conditions that should succeed when TypeScript resolves from package.json.
   */
  customConditions?: string[];

  /**
   * Anything that uses the type modifier is dropped entirely.
   *
   * @defaultValue false
   */
  verbatimModuleSyntax?: boolean;

  /**
   * Suppress deprecation warnings
   */
  ignoreDeprecations?: IgnoreDeprecations;
}

export type WatchFileKind =
  | "FixedPollingInterval"
  | "PriorityPollingInterval"
  | "DynamicPriorityPolling"
  | "FixedChunkSizePolling"
  | "UseFsEvents"
  | "UseFsEventsOnParentDirectory";

export type WatchDirectoryKind =
  | "UseFsEvents"
  | "FixedPollingInterval"
  | "DynamicPriorityPolling"
  | "FixedChunkSizePolling";

export type PollingWatchKind =
  | "FixedInterval"
  | "PriorityInterval"
  | "DynamicPriority"
  | "FixedChunkSize";

export interface WatchOptions {
  /**
   * Specify the strategy for watching individual files.
   *
   * @defaultValue 'UseFsEvents'
   */
  watchFile?: WatchFileKind | Lowercase<WatchFileKind>;

  /**
   * Specify the strategy for watching directories under systems that lack recursive file-watching functionality.
   *
   * @defaultValue 'UseFsEvents'
   */
  watchDirectory?: WatchDirectoryKind | Lowercase<WatchDirectoryKind>;

  /**
   * Specify the polling strategy to use when the system runs out of or doesn't support native file watchers.
   */
  fallbackPolling?: PollingWatchKind | Lowercase<PollingWatchKind>;

  /**
   * Enable synchronous updates on directory watchers for platforms that don't support recursive watching natively.
   */
  synchronousWatchDirectory?: boolean;

  /**
   * Specifies a list of directories to exclude from watch
   */
  excludeDirectories?: string[];

  /**
   * Specifies a list of files to exclude from watch
   */
  excludeFiles?: string[];
}

/**
 * Auto type (.d.ts) acquisition options for this project.
 */
export interface TypeAcquisition {
  /**
   * Enable auto type acquisition.
   */
  enable?: boolean;

  /**
   * Specifies a list of type declarations to be included in auto type acquisition. For example, `['jquery', 'lodash']`.
   */
  include?: string[];

  /**
   * Specifies a list of type declarations to be excluded from auto type acquisition. For example, `['jquery', 'lodash']`.
   */
  exclude?: string[];
}

export interface References {
  /**
   * A normalized path on disk.
   */
  path: string;

  /**
   * The path as the user originally wrote it.
   */
  originalPath?: string;

  /**
   * True if the output of this reference should be prepended to the output of this project.
   *
   * Only valid for `--outFile` compilations.
   * @deprecated This option will be removed in TypeScript 5.5.
   */
  prepend?: boolean;

  /**
   * True if it is intended that this reference form a circularity.
   */
  circular?: boolean;
}

/**
 * Type for [TypeScript's `tsconfig.json` file](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) (TypeScript 3.7).
 */
export interface TsConfigJson {
  /**
   * Instructs the TypeScript compiler how to compile `.ts` files.
   */
  compilerOptions?: CompilerOptions;

  /**
   * Instructs the TypeScript compiler how to watch files.
   */
  watchOptions?: WatchOptions;

  /**
   * Auto type (.d.ts) acquisition options for this project.
   */
  typeAcquisition?: TypeAcquisition;

  /**
   * Enable Compile-on-Save for this project.
   */
  compileOnSave?: boolean;

  /**
   * Path to base configuration file to inherit from.
   */
  extends?: string | string[];

  /**
   * If no `files` or `include` property is present in a `tsconfig.json`, the compiler defaults to including all files in the containing directory and subdirectories except those specified by `exclude`. When a `files` property is specified, only those files and those specified by `include` are included.
   */
  files?: string[];

  /**
   * A value used by [Deepkit](https://deepkit.io/documentation/runtime-types/getting-started) to enable the generation of runtime types.
   */
  reflection?: boolean;

  /**
   * Specifies a list of files to be excluded from compilation. The `exclude` property only affects the files included via the `include` property and not the `files` property.
   *
   * Glob patterns require TypeScript version 2.0 or later.
   */
  exclude?: FilterPattern[];

  /**
   * Specifies a list of glob patterns that match files to be included in compilation.
   *
   * If no `files` or `include` property is present in a `tsconfig.json`, the compiler defaults to including all files in the containing directory and subdirectories except those specified by `exclude`.
   */
  include?: FilterPattern[];

  /**
   * Referenced projects.
   */
  references?: References[];
}
