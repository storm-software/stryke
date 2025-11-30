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

import { createServer } from "node:http";

/**
 * Finds and returns a free port on the local machine by creating a temporary server that listens on port 0. The operating system assigns an available port, which is then retrieved and returned.
 *
 * @returns A promise that resolves to a free port number.
 */
export async function getFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer(() => {});
    server.listen(0, () => {
      const address = server.address();
      server.close();

      if (address && typeof address === "object") {
        resolve(address.port);
      } else {
        reject(
          new Error(`invalid address from server: ${address?.toString()}`)
        );
      }
    });
  });
}
