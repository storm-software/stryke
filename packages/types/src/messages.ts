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

export type MessageType = "help" | "error" | "warning" | "info" | "success";

export type MessageDetails<TMessageType extends MessageType = MessageType> =
  | {
      code: string;
      message?: string;
      type: TMessageType;
      params?: Record<string, any>;
    }
  | {
      code?: string;
      message: string;
      type: TMessageType;
      params?: Record<string, any>;
    };

export type HelpMessageDetails = MessageDetails<"help">;
export type ErrorMessageDetails = MessageDetails<"error">;
export type WarningMessageDetails = MessageDetails<"warning">;
export type InfoMessageDetails = MessageDetails<"info">;
export type SuccessMessageDetails = MessageDetails<"success">;
