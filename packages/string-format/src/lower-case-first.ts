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
 * Lower case the first character of an input string.
 *
 * @remarks
 * "tHISISANEXAMPLE"
 *
 * @param input - The input string.
 * @returns The lower-cased string.
 */
export const lowerCaseFirst = (input?: string): string | undefined => {
  return input ? input.charAt(0).toLowerCase() + input.slice(1) : input;
};
