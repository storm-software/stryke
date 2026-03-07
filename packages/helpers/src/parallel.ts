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

export interface RunParallelOptions {
  /**
   * The maximum number of tasks to run concurrently. This option is required and must be a positive integer.
   */
  concurrency: number;
  /**
   * An optional interval (in milliseconds) to wait between the execution of each task. If specified, the function will wait for the specified interval before starting the next task. If not specified, tasks will be executed immediately one after another without any delay.
   */
  interval?: number;
}

/**
 * Executes a callback function on a set of inputs in parallel, with a specified concurrency limit and optional interval between task executions.
 *
 * @param inputs - A set of inputs to process.
 * @param cb - A callback function that takes an input and returns a value or a promise. This function will be executed for each input in the set.
 * @param options - An object containing options for the parallel execution
 * @returns A promise that resolves to an object containing an array of errors that occurred during the execution of the tasks. If no errors occurred, the array will be empty.
 */
export async function runParallel<T>(
  inputs: Set<T>,
  cb: (input: T) => unknown | Promise<unknown>,
  options: RunParallelOptions
): Promise<{ errors: unknown[] }> {
  const errors: unknown[] = [];
  const tasks = new Set<Promise<unknown>>();

  function queueNext(): undefined | Promise<unknown> {
    const route = inputs.values().next().value;
    if (!route) {
      return;
    }

    inputs.delete(route);
    const task = (
      options.interval
        ? new Promise(resolve => {
            setTimeout(resolve, options.interval);
          })
        : Promise.resolve()
    )
      .then(() => cb(route))
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error(error);
        errors.push(error);
      });

    tasks.add(task);
    return task.then(async () => {
      tasks.delete(task);
      if (inputs.size > 0) {
        return refillQueue();
      }

      return void 0;
    });
  }

  async function refillQueue(): Promise<unknown> {
    const workers = Math.min(options.concurrency - tasks.size, inputs.size);

    return Promise.all(
      Array.from({ length: workers }, async () => queueNext())
    );
  }

  await refillQueue();
  return { errors };
}
