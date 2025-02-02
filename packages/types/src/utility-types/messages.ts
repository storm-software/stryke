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

export type MessageType = "help" | "error" | "warning" | "info" | "success";

export const MessageType = {
  HELP: "help" as MessageType,
  ERROR: "error" as MessageType,
  WARNING: "warning" as MessageType,
  INFO: "info" as MessageType,
  SUCCESS: "success" as MessageType
};

export type MessageDetails<
  TMessageType extends
    | typeof MessageType.HELP
    | typeof MessageType.ERROR
    | typeof MessageType.WARNING
    | typeof MessageType.INFO
    | typeof MessageType.SUCCESS =
    | typeof MessageType.HELP
    | typeof MessageType.ERROR
    | typeof MessageType.WARNING
    | typeof MessageType.INFO
    | typeof MessageType.SUCCESS
> =
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

export type HelpMessageDetails = MessageDetails<typeof MessageType.HELP>;
export type ErrorMessageDetails = MessageDetails<typeof MessageType.ERROR>;
export type WarningMessageDetails = MessageDetails<typeof MessageType.WARNING>;
export type InfoMessageDetails = MessageDetails<typeof MessageType.INFO>;
export type SuccessMessageDetails = MessageDetails<typeof MessageType.SUCCESS>;
