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

import { removeAccents } from "@stryke/helpers/remove-accents";

/**
 * Converts a string by replacing special characters and diacritical marks with their ASCII equivalents.
 * For example, "Crème brûlée" becomes "Creme brulee".
 *
 * @param str - The input string to be deburred.
 * @returns The deburred string with special characters replaced by their ASCII equivalents.
 *
 * @example
 * // Basic usage:
 * deburr('Æthelred') // returns 'Aethelred'
 *
 * @example
 * // Handling diacritical marks:
 * deburr('München') // returns 'Munchen'
 *
 * @example
 * // Special characters:
 * deburr('Crème brûlée') // returns 'Creme brulee'
 */
export function deburr(str: string): string {
  return removeAccents(str.normalize("NFD"));
}
