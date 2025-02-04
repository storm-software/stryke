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

/**
 * Creates a data URI from a string of data.
 *
 * @param data - The data to convert to a data URI.
 * @param mime - The MIME type of the data.
 * @returns The data URI.
 */
export const formatDataURI = (data: string, mime: string): string =>
  `data:${mime};utf8,${encodeURIComponent(data)}`;
