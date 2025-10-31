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

import { stripStars } from "./correct-path";

describe("stripStars", () => {
  it("stripStars - single star", () => {
    const result = stripStars("hello/*");
    expect(result).toBe("hello");
  });

  it("stripStars - multiple stars", () => {
    const result = stripStars("hello/**/*");
    expect(result).toBe("hello");
  });
});
