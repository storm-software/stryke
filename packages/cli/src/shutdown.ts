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

import type { MaybePromise } from "@stryke/types";
import { format } from "./utils/format";

const errorTypes = ["unhandledRejection", "uncaughtException"];
const signalTraps = ["SIGTERM", "SIGINT", "SIGUSR2"];

export async function registerShutdown(onShutdown?: () => MaybePromise<any>) {
  let exited = false;
  const shutdown = async (code: number | string | null | undefined = 0) => {
    try {
      if (exited) {
        return;
      }

      console.log(
        format({
          message: "Terminating the application...",
          type: "start"
        })
      );
      exited = true;

      if (onShutdown) {
        await Promise.resolve(onShutdown());
      }

      console.log(
        format({
          message: "Successfully terminated the application",
          type: "success"
        })
      );
      process.exit(code);
    } catch (error) {
      console.log(
        format({
          message: "Shutdown process failed to complete",
          type: "fail"
        })
      );
      console.error(error);

      process.exit(1);
    }
  };

  for (const type of errorTypes) {
    process.on(type, e => {
      console.info(
        format({
          message: `Received ${type} error event`,
          type: "info"
        })
      );
      console.error(e);

      void shutdown(1);
    });
  }

  for (const type of signalTraps) {
    process.once(type, () => {
      console.info(
        format({
          message: `Received ${type} signal`,
          type: "info"
        })
      );

      void shutdown();
    });
  }

  return async (code: number | string | null | undefined = 0) => {
    console.info(
      format({
        message: `Manual shutdown ${code ? `(${code})` : ""}`,
        type: "info"
      })
    );

    await shutdown(code);
  };
}
