/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/projects/stryke/license.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://stormsoftware.com/projects/stryke/docs
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import type { MessageDetails, MessageType } from "./messages";

export type ValidationDetail<TMessageType extends MessageType = MessageType> =
  MessageDetails<TMessageType> & {
    /**
     * The field path that the message is related to.
     *
     * @remarks
     * If `undefined` or `null`, the message is not related to a specific field - in this case it is likely a global/form message.
     */
    path?: string | null;
  };

export type ErrorValidationDetail = ValidationDetail<"error">;
export type WarningValidationDetail = ValidationDetail<"warning">;
export type InfoValidationDetail = ValidationDetail<"info">;
export type HelpValidationDetail = ValidationDetail<"help">;
export type SuccessValidationDetail = ValidationDetail<"success">;

export type InferValidationType<TMessageType extends MessageType> =
  TMessageType extends "error"
    ? ErrorValidationDetail
    : TMessageType extends "warning"
      ? WarningValidationDetail
      : TMessageType extends "help"
        ? InfoValidationDetail
        : TMessageType extends "info"
          ? SuccessValidationDetail
          : ValidationDetail;
