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

import { isObject } from "@stryke/type-checks/is-object";
import { isString } from "@stryke/type-checks/is-string";
import type { CoerceOptions, Range, ReleaseType, SemVer } from "semver";
import {
  RELEASE_TYPES,
  coerce,
  inc,
  parse,
  satisfies,
  valid,
  validRange
} from "semver";

/**
 * Parse a semver string into a SemVer object
 *
 * @param semver - The semver string to parse
 * @param loose - Whether to use loose parsing
 * @returns The parsed SemVer object
 */
export const parseVersion = (semver: string, loose = true) =>
  parse(semver, loose);

/**
 * Coerce a version string into a valid SemVer string
 *
 * @param version - The version string or number or {@link SemVer} to coerce
 * @param options - Options to use when coercing the version
 * @returns The coerced SemVer string or null if invalid
 */
export const coerceVersion = (
  version: string | number | SemVer | null | undefined,
  options?: CoerceOptions
): SemVer | null => {
  return coerce(version, options);
};

/**
 * Type check for {@link SemVer}
 *
 * @param val - The value to check
 * @returns Whether the value is a valid {@link SemVer}
 */
export const isSemver = (val: any): val is SemVer => {
  return isObject(val) && "version" in val;
};

/**
 * Type check for {@link Range}
 *
 * @param val - The value to check
 * @returns Whether the value is a valid {@link Range}
 */
export const isRange = (val: any): val is Range => {
  return isObject(val) && "range" in val;
};

/**
 * Check if a {@link SemVer} string is valid
 *
 * @remarks
 * If you're looking for type checking, please use the {@link isSemver} function.
 *
 * @param semver - The semver string to check
 * @param loose - Whether to use loose parsing
 * @returns Whether the semver string is valid
 */
export const isValidSemver = (semver: any, loose = true): boolean => {
  return (
    (isString(semver) || isSemver(semver)) && valid(semver, loose) !== null
  );
};

/**
 * Check if a {@link Range} string is valid
 *
 * @remarks
 * If you're looking for type checking, please use the {@link isRange} function.
 *
 * @param range - The range string to check
 * @param loose - Whether to use loose parsing
 * @returns Whether the range string is valid
 */
export const isValidRange = (range: any, loose = true): boolean => {
  return (
    (isString(range) || isRange(range)) && validRange(range, loose) !== null
  );
};

/**
 * Check if a {@link SemVer} or {@link Range} string is valid
 *
 * @param version - The semver string to check
 * @param loose - Whether to use loose parsing
 * @returns Whether the semver string is valid
 */
export const isValidVersion = (
  version: string | SemVer | Range | null | undefined,
  loose = true
) => {
  return isValidSemver(version, loose) || isValidRange(version, loose);
};

/**
 * Check if a semver string satisfies a range
 *
 * @param version - The semver string to check
 * @param range - The range to check against
 * @param loose - Whether to use loose parsing
 * @returns Whether the semver string satisfies the range
 */
export const satisfiesVersion = (
  version: string | SemVer | null | undefined,
  range: string | Range | null | undefined,
  loose = true
) => {
  if (
    !version ||
    !range ||
    !isValidSemver(version, loose) ||
    !isValidRange(range, loose)
  ) {
    return false;
  }

  return satisfies(version, range, { loose });
};

/**
 * Check if a string is a valid relative version keyword
 *
 * @param val - The string to check
 * @returns Whether the string is a valid relative version keyword
 */
export const isRelativeVersionKeyword = (val: string): val is ReleaseType => {
  return RELEASE_TYPES.includes(val as ReleaseType);
};

/**
 * Derive a new semver version from the current version and a version specifier
 *
 * @param currentSemverVersion - The current semver version
 * @param semverSpecifier - The semver specifier to use
 * @param preid - The pre-release identifier to use
 * @returns The derived new semver version
 */
export const deriveNewSemverVersion = (
  currentSemverVersion: string,
  semverSpecifier: string,
  preid?: string
) => {
  if (!valid(currentSemverVersion)) {
    throw new Error(
      `Invalid semver version "${currentSemverVersion}" provided.`
    );
  }

  let newVersion = semverSpecifier;

  if (isRelativeVersionKeyword(semverSpecifier)) {
    // Derive the new version from the current version combined with the new version specifier.
    const derivedVersion = inc(currentSemverVersion, semverSpecifier, preid);

    if (!derivedVersion) {
      throw new Error(
        `Unable to derive new version from current version "${currentSemverVersion}" and version specifier "${semverSpecifier}"`
      );
    }
    newVersion = derivedVersion;
  } else if (!valid(semverSpecifier)) {
    // Ensure the new version specifier is a valid semver version, given it is not a valid semver keyword
    throw new Error(
      `Invalid semver version specifier "${semverSpecifier}" provided. Please provide either a valid semver version or a valid semver version keyword.`
    );
  }

  return newVersion;
};
