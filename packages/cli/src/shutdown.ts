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
  const shutdown = async (code: number | string | null | undefined = 0) => {
    try {
      if (exited) {
        return;
      }

      consola.start("Terminating the application...");
      exited = true;

      if (onShutdown) {
        await Promise.resolve(onShutdown());
      }

      consola.success("Successfully terminated the application");
      process.exit(code);
    } catch (error) {
      consola.fail("Shutdown process failed to complete");
      consola.error(error);

      process.exit(1);
    }
  };

  for (const type of errorTypes) {
    process.on(type, e => {
      consola.info(`Received ${type} error event`);
      consola.error(e);

      void shutdown(1);
    });
  }

  for (const type of signalTraps) {
    process.once(type, () => {
      consola.info(`Received ${type} signal`);

      void shutdown();
    });
  }

  return async (reason: string | number) => {
    consola.info(`Manual shutdown ${reason ? `(${reason})` : ""}`);
    await shutdown();
  };
}
