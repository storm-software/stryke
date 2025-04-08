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

/**
 * A counting semaphore for async functions that manages available permits.
 * Semaphores are mainly used to limit the number of concurrent async tasks.
 *
 * Each `acquire` operation takes a permit or waits until one is available.
 * Each `release` operation adds a permit, potentially allowing a waiting task to proceed.
 *
 * The semaphore ensures fairness by maintaining a FIFO (First In, First Out) order for acquirers.
 *
 * @example
 * const sema = new Semaphore(2);
 *
 * async function task() {
 *   await sema.acquire();
 *   try {
 *     // This code can only be executed by two tasks at the same time
 *   } finally {
 *     sema.release();
 *   }
 * }
 *
 * task();
 * task();
 * task(); // This task will wait until one of the previous tasks releases the semaphore.
 */
export class Semaphore {
  /**
   * The maximum number of concurrent operations allowed.
   */
  public capacity: number;

  /**
   * The number of available permits.
   */
  public available: number;

  private deferredTasks: Array<() => void> = [];

  /**
   * Creates an instance of Semaphore.
   * @param capacity - The maximum number of concurrent operations allowed.
   *
   * @example
   * ```ts
   * const sema = new Semaphore(3); // Allows up to 3 concurrent operations.
   * ```
   */
  constructor(capacity: number) {
    this.capacity = capacity;
    this.available = capacity;
  }

  /**
   * Acquires a semaphore, blocking if necessary until one is available.
   *
   * @example
   * ```ts
   * const sema = new Semaphore(1);
   *
   * async function criticalSection() {
   *   await sema.acquire();
   *   try {
   *     // This code section cannot be executed simultaneously
   *   } finally {
   *     sema.release();
   *   }
   * }
   * ```
   *
   * @returns A promise that resolves when the semaphore is acquired.
   */
  async acquire(): Promise<void> {
    if (this.available > 0) {
      this.available--;
      return;
    }

    return new Promise<void>(resolve => {
      this.deferredTasks.push(resolve);
    });
  }

  /**
   * Releases a semaphore, allowing one more operation to proceed.
   *
   * @example
   * const sema = new Semaphore(1);
   *
   * async function task() {
   *   await sema.acquire();
   *   try {
   *     // This code can only be executed by two tasks at the same time
   *   } finally {
   *     sema.release(); // Allows another waiting task to proceed.
   *   }
   * }
   */
  release(): void {
    const deferredTask = this.deferredTasks.shift();

    if (deferredTask != null) {
      deferredTask();
      return;
    }

    if (this.available < this.capacity) {
      this.available++;
    }
  }
}
