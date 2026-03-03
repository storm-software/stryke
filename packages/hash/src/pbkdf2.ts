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

/**
 * Hash a password using PBKDF2 (Web Crypto compatible alternative to Argon2) with SHA-256, 100,000 iterations, and a random salt. The resulting hash is formatted as: `$pbkdf2-sha256$iterations$salt$hash`.
 *
 * @remarks
 * This function uses the Web Crypto API to perform password hashing. It generates a random salt for each password, and uses PBKDF2 with SHA-256 and 100,000 iterations to derive a secure hash. The output is a string that includes the algorithm, iteration count, salt, and hash, which can be stored in a database for later verification using the {@link verifyPassword} function.
 *
 * @param password - The password to hash.
 * @returns A promise that resolves to the hashed password string.
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const hash = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    256
  );

  // Format: $pbkdf2-sha256$iterations$salt$hash
  const saltB64 = btoa(String.fromCharCode(...salt));
  const hashB64 = btoa(String.fromCharCode(...new Uint8Array(hash)));

  return `$pbkdf2-sha256$100000$${saltB64}$${hashB64}`;
}

/**
 * Verify a password against a stored hash in the format produced by {@link hashPassword}.
 *
 * @param password - The password to verify.
 * @param storedHash - The stored hash to verify against.
 * @returns A promise that resolves to true if the password is correct, false otherwise.
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  const parts = storedHash.split("$");
  if (
    parts.length !== 5 ||
    parts[1] !== "pbkdf2-sha256" ||
    !parts[2] ||
    !parts[3] ||
    !parts[4]
  ) {
    return false;
  }

  const iterations = Number.parseInt(parts[2], 10);
  const salt = Uint8Array.from(atob(parts[3]), c => c.charCodeAt(0));
  const expectedHash = parts[4];

  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const hash = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations,
      hash: "SHA-256"
    },
    keyMaterial,
    256
  );

  return btoa(String.fromCharCode(...new Uint8Array(hash))) === expectedHash;
}
