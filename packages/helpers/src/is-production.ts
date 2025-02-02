/*-------------------------------------------------------------------

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

 -------------------------------------------------------------------*/

/**
 * Check the current runtime mode of the process
 *
 * @param mode - The mode to check the current process's mode against
 * @param env - An optional environment name to check the current process's mode against
 * @returns An indicator specifying if the current runtime matches the `mode` parameter
 */
export const isMode = (mode: string, env: string): boolean =>
  env?.toLowerCase() === mode;

/**
 * The function checks if the code is running in production.
 *
 * @param env - An environment name to check the current process's mode against
 * @returns A boolean indicating if the code is running in production.
 */
export const isProduction = (env: string): boolean => isMode("production", env);

/**
 * The function checks if the code is **NOT** running in production.
 *
 * @remarks
 * **Please note:** This function does **not** check if the mode equals 'development' specifically.
 *
 * To check for the 'development' mode specifically, run:
 *
 * ```typescript
 * const isDevelopmentSpecifically = isMode("development");
 * ```
 * @param env - An environment name to check the current process's mode against
 * @returns A boolean indicating if the code is **NOT** running in production.
 */
export const isDevelopment = (env: string): boolean => !isProduction(env);
