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

const alphabet = Array.from({ length: 26 }, (_x, i) =>
  String.fromCodePoint(i + 97)
);

/**
 * Generate a random integer
 *
 * @param maximum - The maximum value (inclusive)
 * @param minimum - The minimum value (inclusive)
 * @returns A random integer
 */
export const randomInteger = (maximum: number, minimum = 0) =>
  Math.floor(Math.random() * (maximum - minimum + 1) + minimum);

/**
 * Generate a random letter
 *
 * @param random - The random number generator
 * @returns A random letter
 */
export const randomLetter = (random: () => number = Math.random) =>
  alphabet[Math.floor(random() * alphabet.length)];

/**
 * Generate a random string
 *
 * @param array - The array to fill with random values
 * @returns The array filled with random values
 */
export function getNonCryptoRandomValues(array: Uint8Array) {
  if (array === null) {
    throw new TypeError("array cannot be null");
  }

  // Fill the array with random values
  for (let i = 0; i < array.length; i++) {
    array[i] = Math.floor(Math.random() * 256); // Random byte (0-255)
  }

  return array;
}

/**
 * Generate a series of random characters
 *
 * @param length - The length of the random characters
 * @returns A series of random characters
 */
export function randomCharacters(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
