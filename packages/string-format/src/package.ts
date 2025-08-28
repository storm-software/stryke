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

/**
 * Check if a package name has a version
 *
 * @example
 * ```typescript
 * hasPackageVersion("lodash@4.17.21");
 * // => true
 * hasPackageVersion("@stryke/core@4.17.21");
 * // => true
 * hasPackageVersion("lodash");
 * // => false
 * hasPackageVersion("@stryke/core");
 * // => false
 * hasPackageVersion("lodash/module");
 * // => false
 * hasPackageVersion("@stryke/core/module");
 * // => false
 * hasPackageVersion("lodash/module@4.17.21");
 * // => true
 * hasPackageVersion("@stryke/core/module@4.17.21");
 * // => true
 * ```
 *
 * @param value - The package name with version
 * @returns Whether the package name has a version
 */
export function hasPackageVersion(value: string): boolean {
  return /^.[^\n\r@\u2028\u2029]*@.*$/.test(value);
}

/**
 * Remove the version from a package name (if it exists)
 *
 * @example
 * ```typescript
 * removePackageVersion("lodash@4.17.21");
 * // => "lodash"
 * removePackageVersion("@stryke/core@4.17.21");
 * // => "@stryke/core"
 * removePackageVersion("lodash");
 * // => "lodash"
 * removePackageVersion("@stryke/core");
 * // => "@stryke/core"
 * getPackageName("lodash/module");
 * // => "lodash/module"
 * getPackageName("@stryke/core/module");
 * // => "@stryke/core/module"
 * getPackageName("lodash/module@4.17.21");
 * // => "lodash/module"
 * getPackageName("@stryke/core/module@4.17.21");
 * // => "@stryke/core/module"
 * ```
 *
 * @param value - The package name with version
 * @returns The package name without version
 */
export function removePackageVersion(value: string) {
  return hasPackageVersion(value)
    ? value.substring(0, value.lastIndexOf("@"))
    : value;
}

/**
 * Get the package name from a scoped package string
 *
 * @example
 * ```typescript
 * getPackageName("lodash@4.17.21");
 * // => "lodash"
 * getPackageName("@stryke/core@4.17.21");
 * // => "@stryke/core"
 * getPackageName("lodash");
 * // => "lodash"
 * getPackageName("@stryke/core");
 * // => "@stryke/core"
 * getPackageName("lodash/module");
 * // => "lodash"
 * getPackageName("@stryke/core/module");
 * // => "@stryke/core"
 * getPackageName("lodash/module@4.17.21");
 * // => "lodash"
 * getPackageName("@stryke/core/module@4.17.21");
 * // => "@stryke/core"
 * ```
 *
 * @param value - The scoped package string
 * @returns The package name without the scope
 */
export function getPackageName(value: string) {
  return /^[^\n\r/\u2028\u2029]*\/.[^\n\r/\u2028\u2029]*\/.*$/.test(value)
    ? value.substring(0, value.lastIndexOf("/"))
    : removePackageVersion(value);
}

/**
 * Get the package version from a scoped package string
 *
 * @example
 * ```typescript
 * getPackageName("lodash@4.17.21");
 * // => "4.17.21"
 * getPackageName("@stryke/core@4.17.21");
 * // => "4.17.21"
 * getPackageName("lodash");
 * // => undefined
 * getPackageName("@stryke/core");
 * // => undefined
 * getPackageName("lodash/module");
 * // => undefined
 * getPackageName("@stryke/core/module");
 * // => undefined
 * getPackageName("lodash/module@4.17.21");
 * // => "4.17.21"
 * getPackageName("@stryke/core/module@4.17.21");
 * // => "4.17.21"
 * ```
 *
 * @param value - The scoped package string
 * @returns The package version without the package name if it exists. If not, returns undefined.
 */
export function getPackageVersion(value: string): string | undefined {
  return hasPackageVersion(value) ? value.replace(/^.+@/, "") : undefined;
}
