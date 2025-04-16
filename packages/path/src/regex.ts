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

export const DRIVE_LETTER_START_REGEX = /^[A-Z]:\//i;
export const DRIVE_LETTER_REGEX = /^[A-Z]:$/i;

export const UNC_REGEX = /^[/\\]{2}/;

export const ABSOLUTE_PATH_REGEX =
  /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^~[/\\]|^[A-Z]:[/\\]/i;
