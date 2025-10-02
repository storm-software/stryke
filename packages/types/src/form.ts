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

import type { NameValuePair } from "./utilities";

export type SelectOptionValue = string | number | boolean | null;

/**
 * A utility type for specifying the type of an option for a Select or Radio form field.
 */
export interface SelectOption<
  TValue extends SelectOptionValue = SelectOptionValue,
  TName = string
> extends NameValuePair<TValue, TName> {
  /**
   * The index of the select option
   */
  index: number;

  /**
   * The description of the select option
   */
  description?: string;

  /**
   * A short string describing the status of the select option
   */
  status?: string;

  /**
   * An optional icon to display in the select option
   */
  icon?: any;

  /**
   * An optional image to display in the select option
   */
  image?: any;

  /**
   * Is the option value valid for selection in the dropdown
   */
  disabled: boolean;

  /**
   * Sets or retrieves whether the option in the list box is the default item.
   */
  selected: boolean;
}
