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

import { throttle } from "@stryke/helpers/throttle";
import { useEffect, useState } from "react";

/**
 * A hook that returns a boolean indicating if the user is idle.
 *
 * @param ms - The number of milliseconds to wait before considering the user as idle
 * @returns A boolean indicating if the user is idle
 */
export const useIdle = (ms = 1000 * 60): boolean => {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    let timeoutId: any = -1;

    const handleTimeout = () => {
      setIdle(true);
    };

    const handleEvent = throttle(() => {
      setIdle(false);

      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleTimeout, ms);
    }, 500);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        handleEvent();
      }
    };

    timeoutId = setTimeout(handleTimeout, ms);

    addEventListener("mousemove", handleEvent);
    addEventListener("mousedown", handleEvent);
    window.addEventListener("resize", handleEvent);
    addEventListener("keydown", handleEvent);
    addEventListener("touchstart", handleEvent);
    window.addEventListener("wheel", handleEvent);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      removeEventListener("mousemove", handleEvent);
      removeEventListener("mousedown", handleEvent);
      window.removeEventListener("resize", handleEvent);
      removeEventListener("keydown", handleEvent);
      removeEventListener("touchstart", handleEvent);
      window.removeEventListener("wheel", handleEvent);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearTimeout(timeoutId);
    };
  }, [ms]);

  return idle;
};
