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

const htmlEscapes: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};

/**
 * Converts the characters "&", "\<", "\>", '"', and "'" in `str` to their corresponding HTML entities.
 * For example, "\<" becomes "&lt;".
 *
 *
 * @example
 * ```ts
 * escapeHtml('This is a <div> element.'); // returns 'This is a &lt;div&gt; element.'
 * escapeHtml('This is a "quote"'); // returns 'This is a &quot;quote&quot;'
 * escapeHtml("This is a 'quote'"); // returns 'This is a &#39;quote&#39;'
 * escapeHtml('This is a & symbol'); // returns 'This is a &amp; symbol'
 * ```
 *
 * @param str - The string to escape.
 * @returns Returns the escaped string.
 */
export function escapeHtml(str: string): string {
  return str.replace(/["&'<>]/g, match => htmlEscapes[match] || "");
}

/**
 * Escapes RegExp special characters in the given string.
 *
 * @example
 * ```ts
 * escapeRegExp('what'); // returns 'what'
 * escapeRegExp('what?'); // returns 'what\?'
 * escapeRegExp('Price is $5.00'); // returns 'Price is \$5\.00'
 * escapeRegExp('Use * as a wildcard'); // returns 'Use \* as a wildcard'
 * ```
 *
 * @param str - The string to escape.
 * @returns Returns the escaped string.
 */
export function escapeRegExp(str: string) {
  // Escape characters with special meaning either inside or outside character sets.
  // Use a simple backslash escape when it’s always valid, and a `\xnn` escape when
  // the simpler form would be disallowed by Unicode patterns’ stricter grammar.
  return str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
