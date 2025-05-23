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

import type { ReleaseType } from "semver";
import { RELEASE_TYPES, inc, parse, valid } from "semver";

export const parseVersion = (semver: string) => parse(semver);

export const isRelativeVersionKeyword = (val: string): val is ReleaseType => {
  return RELEASE_TYPES.includes(val as ReleaseType);
};

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
