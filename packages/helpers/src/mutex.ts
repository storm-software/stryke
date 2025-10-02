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

import { Semaphore } from "./semaphore";

/**
 * A Mutex (mutual exclusion lock) for async functions.
 * It allows only one async task to access a critical section at a time.
 *
 * @example
 * ```typescript
 * const mutex = new Mutex();
 *
 * async function criticalSection() {
 *   await mutex.acquire();
 *   try {
 *     // This code section cannot be executed simultaneously
 *   } finally {
 *     mutex.release();
 *   }
 * }
 *
 * criticalSection();
 * criticalSection(); // This call will wait until the first call releases the mutex.
 * ```
 */
export class Mutex {
  private semaphore = new Semaphore(1);

  /**
   * Checks if the mutex is currently locked.
   * @returns True if the mutex is locked, false otherwise.
   *
   * @example
   * const mutex = new Mutex();
   * console.log(mutex.isLocked); // false
   * await mutex.acquire();
   * console.log(mutex.isLocked); // true
   * mutex.release();
   * console.log(mutex.isLocked); // false
   */
  public get isLocked(): boolean {
    return this.semaphore.available === 0;
  }

  /**
   * Acquires the mutex, blocking if necessary until it is available.
   * @returns A promise that resolves when the mutex is acquired.
   *
   * @example
   * ```typescript
   * const mutex = new Mutex();
   * await mutex.acquire();
   * try {
   *   // This code section cannot be executed simultaneously
   * } finally {
   *   mutex.release();
   * }
   * ```
   */
  public async acquire(): Promise<void> {
    return this.semaphore.acquire();
  }

  /**
   * Releases the mutex, allowing another waiting task to proceed.
   *
   * @example
   * ```typescript
   * const mutex = new Mutex();
   * await mutex.acquire();
   * try {
   *   // This code section cannot be executed simultaneously
   * } finally {
   *   mutex.release(); // Allows another waiting task to proceed.
   * }
   * ```
   */
  public release(): void {
    this.semaphore.release();
  }
}
