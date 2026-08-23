/* -------------------------------------------------------------------

                       🗲 Storm Software - Stryke

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

export type DangerValidationDetail = ValidationDetail<"danger">;
export type WarningValidationDetail = ValidationDetail<"warning">;
export type InfoValidationDetail = ValidationDetail<"info">;
export type DiscoveryValidationDetail = ValidationDetail<"discovery">;
export type SuccessValidationDetail = ValidationDetail<"success">;
export type PositiveValidationDetail = ValidationDetail<"positive">;
export type NegativeValidationDetail = ValidationDetail<"negative">;

export type InferValidationType<TMessageType extends MessageType> =
  TMessageType extends "danger"
    ? DangerValidationDetail
    : TMessageType extends "warning"
      ? WarningValidationDetail
      : TMessageType extends "discovery"
        ? DiscoveryValidationDetail
        : TMessageType extends "info"
          ? InfoValidationDetail
          : TMessageType extends "success"
            ? SuccessValidationDetail
            : TMessageType extends "positive"
              ? PositiveValidationDetail
              : TMessageType extends "negative"
                ? NegativeValidationDetail
                : ValidationDetail;
