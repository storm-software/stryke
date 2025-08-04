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

import { EMPTY_STRING } from "@stryke/types/base";
import { useCallback, useState } from "react";

function oldSchoolCopy(text: string) {
  const tempTextArea = document.createElement("textarea");
  tempTextArea.value = text;
  document.body.append(tempTextArea);
  tempTextArea.select();
  document.execCommand("copy");
  tempTextArea.remove();
}

/**
 * Copies a value to the clipboard
 *
 * @returns A tuple with the copied value and a function to copy a value to the clipboard
 */
export function useCopyToClipboard() {
  const [state, setState] = useState<string | null>(null);

  const copyToClipboard = useCallback(async (value: string | null) => {
    const handleCopy = async () => {
      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(value ?? EMPTY_STRING);
          setState(value ?? EMPTY_STRING);
        } else {
          throw new Error("writeText not supported");
        }
      } catch {
        oldSchoolCopy(value ?? EMPTY_STRING);
        setState(value ?? EMPTY_STRING);
      }
    };

    await handleCopy();
  }, []);

  return [state, copyToClipboard];
}
