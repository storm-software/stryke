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

import type { MessageDetails, MessageType } from "./messages";

export type ValidationDetails<
  TMessageType extends
    | typeof MessageType.ERROR
    | typeof MessageType.WARNING
    | typeof MessageType.INFO
    | typeof MessageType.HELP
    | typeof MessageType.SUCCESS =
    | typeof MessageType.ERROR
    | typeof MessageType.WARNING
    | typeof MessageType.INFO
    | typeof MessageType.HELP
    | typeof MessageType.SUCCESS
> = MessageDetails<TMessageType> & {
  /**
   * The field path that the message is related to.
   *
   * @remarks
   * If `undefined` or `null`, the message is not related to a specific field - in this case it is likely a global/form message.
   */
  field?: string | null;
};

export type ErrorValidationDetails = ValidationDetails<
  typeof MessageType.ERROR
>;
export type WarningValidationDetails = ValidationDetails<
  typeof MessageType.WARNING
>;
export type InfoValidationDetails = ValidationDetails<typeof MessageType.INFO>;
export type HelpValidationDetails = ValidationDetails<typeof MessageType.HELP>;
export type SuccessValidationDetails = ValidationDetails<
  typeof MessageType.SUCCESS
>;

export type InferValidationType<TMessageType extends MessageType> =
  TMessageType extends typeof MessageType.ERROR
    ? ErrorValidationDetails
    : TMessageType extends typeof MessageType.WARNING
      ? WarningValidationDetails
      : TMessageType extends typeof MessageType.INFO
        ? InfoValidationDetails
        : TMessageType extends typeof MessageType.SUCCESS
          ? SuccessValidationDetails
          : ValidationDetails;
