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

import type { MaybePromise } from "@stryke/types";
import consola from "consola";

const errorTypes = ["unhandledRejection", "uncaughtException"];
const signalTraps = ["SIGTERM", "SIGINT", "SIGUSR2"];

export async function registerShutdown(onShutdown?: () => MaybePromise<any>) {
  let exited = false;
  async function shutdown() {
    if (exited) {
      return;
    }
    consola.info("Shutting down...");
    exited = true;

    if (onShutdown) {
      await Promise.resolve(onShutdown());
    }
  }

  for (const type of errorTypes) {
    process.on(type, e => {
      consola.info(`process.on ${type}`);
      consola.error(e);

      void shutdown()
        .then(() => {
          consola.info("Shutdown process complete, exiting with code 0");
          process.exit(0);
        })
        .catch(error => {
          consola.warn("Shutdown process failed, exiting with code 1");
          consola.error(error);
          process.exit(1);
        });
    });
  }

  for (const type of signalTraps) {
    process.once(type, () => {
      consola.info(`process.on ${type}`);

      void shutdown()
        .then(() => {
          consola.info("Shutdown process complete, exiting with code 0");
          process.exit(0);
        })
        .catch(error => {
          consola.warn("Shutdown process failed, exiting with code 1");
          consola.error(error);
          process.exit(1);
        });
    });
  }

  return async (reason: string | number) => {
    consola.info(`Manual shutdown ${reason ? `(${reason})` : ""}`);

    await shutdown()
      .then(() => {
        consola.info("Shutdown process complete, exiting with code 0");
        process.exit(0);
      })
      .catch(error => {
        consola.warn("Shutdown process failed, exiting with code 1");
        consola.error(error);
        process.exit(1);
      });
  };
}
