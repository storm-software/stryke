/*-------------------------------------------------------------------

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

 -------------------------------------------------------------------*/

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
    let timeoutId: number = -1;

    const handleTimeout = () => {
      setIdle(true);
    };

    const handleEvent = throttle(() => {
      setIdle(false);

      globalThis.clearTimeout(timeoutId);
      timeoutId = globalThis.setTimeout(handleTimeout, ms);
    }, 500);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        handleEvent();
      }
    };

    timeoutId = globalThis.setTimeout(handleTimeout, ms);

    globalThis.addEventListener("mousemove", handleEvent);
    globalThis.addEventListener("mousedown", handleEvent);
    window.addEventListener("resize", handleEvent);
    globalThis.addEventListener("keydown", handleEvent);
    globalThis.addEventListener("touchstart", handleEvent);
    window.addEventListener("wheel", handleEvent);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      globalThis.removeEventListener("mousemove", handleEvent);
      globalThis.removeEventListener("mousedown", handleEvent);
      window.removeEventListener("resize", handleEvent);
      globalThis.removeEventListener("keydown", handleEvent);
      globalThis.removeEventListener("touchstart", handleEvent);
      window.removeEventListener("wheel", handleEvent);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      globalThis.clearTimeout(timeoutId);
    };
  }, [ms]);

  return idle;
};
