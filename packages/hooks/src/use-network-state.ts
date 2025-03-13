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

import { isEqual } from "@stryke/type-checks/is-equal";
import type { NetworkInformation, NetworkState } from "@stryke/types/navigator";
import { useRef, useSyncExternalStore } from "react";

const getConnection = (): NetworkInformation | undefined => {
  const connectionKey = "connection" as keyof typeof navigator;
  const mozConnectionKey = "mozConnection" as keyof typeof navigator;
  const webkitConnectionKey = "webkitConnection" as keyof typeof navigator;

  return (navigator[connectionKey] ||
    navigator[mozConnectionKey] ||
    navigator[webkitConnectionKey]) as NetworkInformation;
};

/**
 * Subscribes to network state changes.
 *
 * @param callback - The callback function to call when the network state changes
 * @returns A function to unsubscribe from the network state changes
 */
export const useNetworkStateSubscribe = (callback: (event: Event) => any) => {
  globalThis.addEventListener("online", callback, { passive: true });
  globalThis.addEventListener("offline", callback, { passive: true });

  const connection = getConnection();

  if (connection) {
    connection.addEventListener("change", callback, { passive: true });
  }

  return () => {
    globalThis.removeEventListener("online", callback);
    globalThis.removeEventListener("offline", callback);

    if (connection) {
      connection.removeEventListener("change", callback);
    }
  };
};

const getNetworkStateServerSnapshot = () => {
  throw new Error("useNetworkState is a client-only hook");
};

/**
 * A hook that returns the network state.
 *
 * @returns The network state
 */
export function useNetworkState() {
  const cache = useRef<NetworkState | {}>({});

  const getSnapshot = (): NetworkState => {
    const online = navigator.onLine;
    const connection = getConnection();

    const nextState = {
      online,
      downlink: connection?.downlink,
      downlinkMax: connection?.downlinkMax,
      effectiveType: connection?.effectiveType,
      rtt: connection?.rtt,
      saveData: connection?.saveData,
      type: connection?.type
    } as NetworkState;

    if (isEqual(cache.current, nextState)) {
      return cache.current as NetworkState;
    }
    cache.current = nextState;
    return nextState;
  };

  return useSyncExternalStore(
    useNetworkStateSubscribe,
    getSnapshot,
    getNetworkStateServerSnapshot
  );
}
