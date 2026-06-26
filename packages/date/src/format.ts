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

// cspell:ignore YYYYMMDDTHHMMSS

export interface FormatDateOptions {
  /**
   * The separator to use between the year, month, and day components of the date.
   *
   * @remarks
   * This option allows you to specify a custom separator character or string to be used when formatting the date. The default separator is a hyphen ("-").
   *
   * @example
   * ```ts
   * const date = new Date(2024, 0, 15); // January 15, 2024
   * const formattedDate = formatYYYYMMDD(date, { separator: "/" }); // formattedDate will be "2024/01/15"
   * ```
   *
   * @defaultValue "-"
   */
  separator?: string;
}

/**
 * A utility function that formats a Date object into a string in the format "YYYY-MM-DD".
 *
 * @remarks
 * This function takes a Date object as input and returns a string representation of the date in the "YYYY-MM-DD" format.
 *
 * @example
 * ```ts
 * const date = new Date(2024, 0, 15); // January 15, 2024
 * const formattedDate = formatYYYYMMDD(date); // formattedDate will be "2024-01-15"
 * const formattedDateWithCustomSeparator = formatYYYYMMDD(date, { separator: "/" }); // formattedDateWithCustomSeparator will be "2024/01/15"
 * ```
 *
 * @param date - The Date object to be formatted.
 * @param options - Optional configuration for formatting the date, including a custom separator.
 * @returns A string representing the formatted date in "YYYY-MM-DD" format.
 */
export function formatYYYYMMDD(
  date: Date,
  options?: FormatDateOptions
): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const separator = options?.separator ?? "-";

  return `${year}${separator}${month}${separator}${day}`;
}

/**
 * A utility function that formats a Date object into a string in the format "MM-DD-YYYY".
 *
 * @remarks
 * This function takes a Date object as input and returns a string representation of the date in the "MM-DD-YYYY" format.
 *
 * @example
 * ```ts
 * const date = new Date(2024, 0, 15); // January 15, 2024
 * const formattedDate = formatMMDDYYYY(date); // formattedDate will be "01-15-2024"
 * const formattedDateWithCustomSeparator = formatMMDDYYYY(date, { separator: "/" }); // formattedDateWithCustomSeparator will be "01/15/2024"
 * ```
 *
 * @param date - The Date object to be formatted.
 * @param options - Optional configuration for formatting the date, including a custom separator.
 * @returns A string representing the formatted date in "MM-DD-YYYY" format.
 */
export function formatMMDDYYYY(
  date: Date,
  options?: FormatDateOptions
): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  const separator = options?.separator ?? "-";

  return `${month}${separator}${day}${separator}${year}`;
}

/**
 * A utility function that formats a Date object into a string in the format "DD-MM-YYYY".
 *
 * @remarks
 * This function takes a Date object as input and returns a string representation of the date in the "DD-MM-YYYY" format.
 *
 * @example
 * ```ts
 * const date = new Date(2024, 0, 15); // January 15, 2024
 * const formattedDate = formatDDMMYYYY(date); // formattedDate will be "15-01-2024"
 * const formattedDateWithCustomSeparator = formatDDMMYYYY(date, { separator: "/" }); // formattedDateWithCustomSeparator will be "15/01/2024"
 * ```
 *
 * @param date - The Date object to be formatted.
 * @param options - Optional configuration for formatting the date, including a custom separator.
 * @returns A string representing the formatted date in "DD-MM-YYYY" format.
 */
export function formatDDMMYYYY(
  date: Date,
  options?: FormatDateOptions
): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const separator = options?.separator ?? "-";

  return `${day}${separator}${month}${separator}${year}`;
}

/**
 * A utility function that formats a Date object into a string in the format "YYYY-MM-DD HH:mm:ss".
 *
 * @remarks
 * This function formats the date portion using the configured separator and appends
 * a time component in 24-hour format separated by spaces.
 *
 * @example
 * ```ts
 * const date = new Date(2024, 0, 15, 13, 45, 30);
 * const formattedDate = formatYYYYMMDDHHmmss(date); // formattedDate will be "2024-01-15 13:45:30"
 * ```
 *
 * @param date - The Date object to be formatted.
 * @param options - Optional configuration for formatting the date, including a custom separator.
 * @returns A string representing the formatted date in "YYYY-MM-DD HH:mm:ss" format.
 */
export function formatYYYYMMDDHHmmss(
  date: Date,
  options?: FormatDateOptions
): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const separator = options?.separator ?? "-";

  return `${year}${separator}${month}${separator}${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * A utility function that formats a Date object into a string in the format "YYYY-MM-DDTHH:mm:ss".
 *
 * @remarks
 * This function formats the date portion using the configured separator and appends
 * a time component in 24-hour format separated by a "T" character.
 *
 * @example
 * ```ts
 * const date = new Date(2024, 0, 15, 13, 45, 30);
 * const formattedDate = formatYYYYMMDDTHHMMSS(date); // formattedDate will be "2024-01-15T13:45:30"
 * ```
 *
 * @param date - The Date object to be formatted.
 * @param options - Optional configuration for formatting the date, including a custom separator.
 * @returns A string representing the formatted date in "YYYY-MM-DDTHH:mm:ss" format.
 */
export function formatYYYYMMDDTHHMMSS(
  date: Date,
  options?: FormatDateOptions
): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const separator = options?.separator ?? "-";

  return `${year}${separator}${month}${separator}${day}T${hours}:${minutes}:${seconds}`;
}

/**
 * A utility function that formats a Date object into a string based on the specified format.
 *
 * @remarks
 * This function takes a Date object and a format string as input and returns a string representation of the date in the specified format. It also accepts optional configuration for customizing the separator used in the date string.
 *
 * @example
 * ```ts
 * const date = new Date(2024, 0, 15); // January 15, 2024
 * const formattedDate1 = formatDate(date, "YYYY-MM-DD"); // formattedDate1 will be "2024-01-15"
 * const formattedDate2 = formatDate(date, "MM-DD-YYYY"); // formattedDate2 will be "01-15-2024"
 * const formattedDate3 = formatDate(date, "DD-MM-YYYY"); // formattedDate3 will be "15-01-2024"
 * const formattedDate4 = formatDate(date, "YYYYMMDD"); // formattedDate4 will be "20240115"
 * const formattedDate5 = formatDate(date, "YYYY/MM/DD"); // formattedDate5 will be "2024/01/15"
 * const formattedDateWithCustomSeparator = formatDate(date, "YYYY-MM-DD", { separator: "/" }); // formattedDateWithCustomSeparator will be "2024/01/15"
 * ```
 *
 * @param date - The Date object to be formatted.
 * @param format - The desired format for the output string.
 * @param options - Optional configuration for formatting the date, including a custom separator.
 * @returns A string representing the formatted date in the specified format.
 * @throws Will throw an error if the specified format is not supported.
 */
export function formatDate(
  date: Date,
  format:
    | "YYYY-MM-DD"
    | "MM-DD-YYYY"
    | "DD-MM-YYYY"
    | "YYYY/MM/DD"
    | "MM/DD/YYYY"
    | "DD/MM/YYYY"
    | "YYYY.MM.DD"
    | "MM.DD.YYYY"
    | "DD.MM.YYYY"
    | "YYYYMMDD"
    | "MMDDYYYY"
    | "DDMMYYYY"
    | "YYYY-MM-DD HH:mm:ss"
    | "YYYY-MM-DDTHH:mm:ss",
  options?: FormatDateOptions
): string {
  switch (format) {
    case "YYYY-MM-DD":
      return formatYYYYMMDD(date, options);
    case "MM-DD-YYYY":
      return formatMMDDYYYY(date, options);
    case "DD-MM-YYYY":
      return formatDDMMYYYY(date, options);
    case "YYYY/MM/DD":
      return formatYYYYMMDD(date, { separator: "/", ...options });
    case "MM/DD/YYYY":
      return formatMMDDYYYY(date, { separator: "/", ...options });
    case "DD/MM/YYYY":
      return formatDDMMYYYY(date, { separator: "/", ...options });
    case "YYYY.MM.DD":
      return formatYYYYMMDD(date, { separator: ".", ...options });
    case "MM.DD.YYYY":
      return formatMMDDYYYY(date, { separator: ".", ...options });
    case "DD.MM.YYYY":
      return formatDDMMYYYY(date, { separator: ".", ...options });
    case "YYYYMMDD":
      return formatYYYYMMDD(date, { separator: "", ...options });
    case "MMDDYYYY":
      return formatMMDDYYYY(date, { separator: "", ...options });
    case "DDMMYYYY":
      return formatDDMMYYYY(date, { separator: "", ...options });
    case "YYYY-MM-DD HH:mm:ss":
      return formatYYYYMMDDHHmmss(date, options);
    case "YYYY-MM-DDTHH:mm:ss":
      return formatYYYYMMDDTHHMMSS(date, options);
    default:
      throw new Error(`Unsupported date format: ${String(format)}`);
  }
}
