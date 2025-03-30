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

export interface BaseContext<
  TPrisma = any | undefined,
  TSession = { user?: any } | undefined,
  THeaders extends { [k: string]: string } | undefined =
    | { [k: string]: string }
    | undefined
> {
  /**
   * The Prisma Client instance.
   */
  prisma: TPrisma;

  /**
   * The session object.
   */
  session: TSession;

  /**
   * The request headers.
   */
  headers: THeaders;
}
