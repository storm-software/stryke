/* -------------------------------------------------------------------

                       🗲 Storm Software - Stryke

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
 * A regex that matches valid GitHub repository references, including optional branches.
 *
 * @remarks
 * A GitHub repository reference string, starting with either `"github:"` or `"gh:"`, an optional branch or tag, and optionally including a specific file path within the repository (for example: `"github:main:storm-software/power-plant/packages/base/resolve/src/types.ts"`). It is also valid to provide the branch or tag after the file path (for example: `"github:storm-software/power-plant/packages/base/resolve/src/types.ts@main"`).
 */
export const GITHUB_REFERENCE_REGEX =
  /^(?:github|gh):(?:[^\s/:@]+:)?[^\s/:@]+\/[^\s/:@]+(?:\/[^\s:@]+)?(?:@[^\s/:@]+)?$/i;

/**
 * A regex that matches valid GitLab repository references, including optional branches.
 *
 * @remarks
 * A GitLab repository reference string, starting with either `"gitlab:"` or `"gl:"`, an optional branch or tag, and optionally including a specific file path within the repository (for example: `"gitlab:master:storm-software/power-plant/packages/base/resolve/src/types.ts"`). It is also valid to provide the branch or tag after the file path (for example: `"gitlab:storm-software/power-plant/packages/base/resolve/src/types.ts@master"`).
 */
export const GITLAB_REFERENCE_REGEX =
  /^(?:gitlab|gl):(?:[^\s/:@]+:)?[^\s/:@]+\/[^\s/:@]+(?:\/[^\s:@]+)?(?:@[^\s/:@]+)?$/i;
