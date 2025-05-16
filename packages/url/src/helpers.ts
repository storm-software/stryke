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

export function formatLocalePath(locale: string) {
  let result = locale;
  if (result.includes("_")) {
    result = result.replace(/_/g, "-");
  }

  if (result.includes("-")) {
    const parts = result.split("-");
    if (parts.length > 1) {
      const lang = parts[0];
      const region = parts[1];
      if (lang && region) {
        result = `${lang}-${region}`;
      }
    }
  }

  return result.toLowerCase();
}
