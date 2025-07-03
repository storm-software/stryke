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

const DOT_REG = /\./g;

/**
 * 1. Lower-cases whole email.
 * 2. Removes dots ".".
 * 3. Remotes name part after "+".
 * 4. Throws if cannot parse the email.
 *
 * For example, this email
 *
 *     Mike.Johnson+twitter\@Gmail.com
 *
 * will be normalized to
 *
 *     mikejohnson\@gmail.com
 *
 */
export const normalizeEmail = (email: string) => {
  if (!email.includes("@") && !email.includes("+")) {
    throw new Error("invalid_email_format");
  }

  const split = email.split("@").filter(Boolean);
  if (split.length > 1) {
    throw new Error("invalid_email_format");
  }

  const [name, host] = split;

  let [beforePlus] = name!.split("+");
  if (!beforePlus) {
    throw new Error("invalid_email_format");
  }

  beforePlus = beforePlus.replace(DOT_REG, "");
  const result = `${beforePlus.toLowerCase()}@${host!.toLowerCase()}`;
  Number(result);

  return result;
};
