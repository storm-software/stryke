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

import { isFunction } from "@stryke/type-checks/is-function";
import type { BatteryManager } from "@stryke/types/navigator";
import React, { useEffect } from "react";

const defaultBatteryManagerState = {
  supported: true,
  loading: true,
  level: null,
  charging: null,
  chargingTime: null,
  dischargingTime: null
};

/**
 * Listens for updates to the mobile/desktop battery status
 */
export function useBattery() {
  const [state, setState] = React.useState<
    Omit<BatteryManager, "addEventListener" | "removeEventListener">
  >(defaultBatteryManagerState);

  const key = "getBattery" as keyof typeof navigator;
  const getBattery = navigator[key] as () => Promise<BatteryManager>;

  useEffect(() => {
    if (!isFunction(getBattery)) {
      setState(s => ({
        ...s,
        supported: false,
        loading: false
      }));
      return;
    }

    let battery = null as BatteryManager | null;

    const handleChange = () => {
      setState({
        ...defaultBatteryManagerState,
        supported: true,
        loading: false,
        ...battery
      });
    };

    void getBattery().then(b => {
      battery = b;
      handleChange();

      b?.addEventListener("levelchange", handleChange);
      b?.addEventListener("chargingchange", handleChange);
      b?.addEventListener("chargingtimechange", handleChange);
      b?.addEventListener("dischargingtimechange", handleChange);
    });

    return () => {
      if (battery) {
        battery.removeEventListener("levelchange", handleChange);
        battery.removeEventListener("chargingchange", handleChange);
        battery.removeEventListener("chargingtimechange", handleChange);
        battery.removeEventListener("dischargingtimechange", handleChange);
      }
    };
  }, [getBattery]);

  return state;
}
