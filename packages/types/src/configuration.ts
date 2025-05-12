/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/projects/stryke/license.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://stormsoftware.com/projects/stryke/docs
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

/**
 * Configuration values for specifying a type definition
 */
export interface TypeDefinition {
  /**
   * The file path to the type definition
   */
  file: string;

  /**
   * The name of the type definition in the file above
   *
   * @remarks
   * If no value is provided, we will attempt to infer the type definition from the module's `default` export.
   */
  name?: string;
}

/**
 * Configuration parameter for the {@link TypeDefinition} utility type
 *
 * @remarks
 * When provided as a string, this value can include both a path to the typescript file and the name of the type definition to use separated by a `":"` or `"#"` character. For example: `"./src/types/env.ts#EnvConfiguration"`.
 */
export type TypeDefinitionParameter = TypeDefinition | string;

export interface DotenvTypeDefinitions {
  /**
   * A path to the type definition for the expected env configuration parameters. This value can include both a path to the typescript file and the name of the type definition to use separated by a `":"` or `"#"` character. For example: `"./src/types/env.ts#Variables"`.
   *
   * @remarks
   * If a value is not provided for this option, the plugin will attempt to infer the type definition from the `storm.dotenv.types.config` object in the project's `package.json` file.
   */
  variables?: TypeDefinitionParameter;

  /**
   * A path to the type definition for the expected env secret parameters. This value can include both a path to the typescript file and the name of the type definition to use separated by a `":"` or `"#"` character. For example: `"./src/types/env.ts#Secrets"`.
   *
   * @remarks
   * If a value is not provided for this option, the plugin will attempt to infer the type definition from the `storm.dotenv.types.secrets` object in the project's `package.json` file.
   */
  secrets?: TypeDefinitionParameter;
}

export interface DotenvConfiguration {
  /**
   * Additional environment variable (.env) files (aside from the default list of files) to load configuration from.
   *
   * @remarks
   * By default, the plugin will load environment variables from `.env` files based on the `mode`. For the `"production"` mode, it will use the following files:
   * - `.env`
   * - `.env.local`
   * - `.env.production`
   * - `.env.production.local`
   */
  additionalFiles?: string[];

  /**
   * The type definitions for the environment variables
   *
   * @remarks
   * This value can be a {@link DotenvTypeDefinitions} or just a path to a typescript file and the `"name"` values are defaulted to the following:
   * - {@link DotenvTypeDefinitions.variables} - `"Variables"`
   * - {@link DotenvTypeDefinitions.secrets} - `"Secrets"`
   */
  types?: DotenvTypeDefinitions | string;
}

export interface StormConfigurationGroups {
  /**
   * The configuration for the loading variable and secrets into the environment via `.env` files
   */
  dotenv?: DotenvConfiguration;
}
