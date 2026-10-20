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

export type MessageType =
  "discovery" | "danger" | "warning" | "info" | "success";

export type MessageDetails<TMessageType extends MessageType = MessageType> =
  | {
      /**
       * The type of the message.
       */
      type: TMessageType;

      /**
       * The code identifying the message.
       */
      code: string;

      /**
       * The main message content.
       */
      message?: string;

      /**
       * An extended version of the message providing more details.
       */
      extendedMessage?: string;

      /**
       * Parameters associated with the message, providing additional context.
       *
       * @remarks
       * If the {@link MessageDetails.message | message} or {@link MessageDetails.extendedMessage | extendedMessage} contains placeholder parameters, the corresponding values should be provided in this record. Example placeholder parameter usage: `"This message uses a {placeholder} parameter"` - the `params` record should include a key `placeholder` with the appropriate value, for example `{ placeholder: "value" }` -\> `"This message uses a value parameter"`.
       */
      params?: Record<string, any>;
    }
  | {
      /**
       * The type of the message.
       */
      type: TMessageType;

      /**
       * The code identifying the message.
       */
      code?: string;

      /**
       * The main message content.
       */
      message: string;

      /**
       * An extended version of the message providing more details.
       */
      extendedMessage?: string;

      /**
       * Parameters associated with the message, providing additional context.
       *
       * @remarks
       * If the {@link MessageDetails.message | message} or {@link MessageDetails.extendedMessage | extendedMessage} contains placeholder parameters, the corresponding values should be provided in this record. Example placeholder parameter usage: `"This message uses a {placeholder} parameter"` - the `params` record should include a key `placeholder` with the appropriate value, for example `{ placeholder: "value" }` -\> `"This message uses a value parameter"`.
       */
      params?: Record<string, any>;
    };

export type DiscoveryMessageDetails = MessageDetails<"discovery">;
export type DangerMessageDetails = MessageDetails<"danger">;
export type WarningMessageDetails = MessageDetails<"warning">;
export type InfoMessageDetails = MessageDetails<"info">;
export type SuccessMessageDetails = MessageDetails<"success">;
