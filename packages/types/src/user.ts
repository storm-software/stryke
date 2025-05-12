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

export type UserType = "external" | "internal" | "service" | "admin";

export interface UserBase {
  /**
   * The user's ID.
   */
  id: string;

  /**
   * The user's full name.
   */
  username?: string;

  /**
   * The user's type.
   *
   * @defaultValue "external"
   */
  type: UserType;

  /**
   * The user's email address.
   */
  email?: string;

  /**
   * The user's role.
   */
  role?: string;
}
