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

import { detectPackageManager } from "@antfu/install-pkg";
import { getWorkspaceRoot } from "@stryke/path/get-workspace-root";
import { execSync } from "node:child_process";
import { parseArgs } from "node:util";

export interface NodeOptionsToken {
  kind: "option";
  index: number;
  name: string;
  rawName: string;
  value: undefined;
  inlineValue: undefined;
}

const parseNodeArgs = (args: string[]) => {
  const { values, tokens } = parseArgs({ args, strict: false, tokens: true });

  // For the `NODE_OPTIONS`, we support arguments with values without the `=`
  // sign. We need to parse them manually.
  let orphan: NodeOptionsToken | null | undefined = null;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]!;

    if (token.kind === "option-terminator") {
      break;
    }

    // When we encounter an option, if it's value is undefined, we should check
    // to see if the following tokens are positional parameters. If they are,
    // then the option is orphaned, and we can assign it.
    if (token.kind === "option") {
      orphan = typeof token.value === "undefined" ? token : null;
      continue;
    }

    // If the token isn't a positional one, then we can't assign it to the found
    // orphaned option.
    if (token.kind !== "positional") {
      orphan = null;
      continue;
    }

    // If we don't have an orphan, then we can skip this token.
    if (!orphan) {
      continue;
    }

    // If the token is a positional one, and it has a value, so add it to the
    // values object. If it already exists, append it with a space.
    if (orphan.name in values && typeof values[orphan.name] === "string") {
      values[orphan.name] += ` ${token.value}`;
    } else {
      values[orphan.name] = token.value;
    }
  }

  return values;
};

/**
 * Tokenizes the arguments string into an array of strings, supporting quoted
 * values and escaped characters.
 * Converted from: https://github.com/nodejs/node/blob/c29d53c5cfc63c5a876084e788d70c9e87bed880/src/node_options.cc#L1401
 *
 * @param input - The arguments string to be tokenized.
 * @returns An array of strings with the tokenized arguments.
 */
export const tokenizeArgs = (input: string): string[] => {
  const args: string[] = [];
  let isInString = false;
  let willStartNewArg = true;

  for (let i = 0; i < input.length; i++) {
    let char = input[i]!;

    // Skip any escaped characters in strings.
    if (char === "\\" && isInString) {
      // Ensure we don't have an escape character at the end.
      if (input.length === i + 1) {
        throw new Error("Invalid escape character at the end.");
      }

      // Skip the next character.
      char = input[++i]!;
    }
    // If we find a space outside of a string, we should start a new argument.
    else if (char === " " && !isInString) {
      willStartNewArg = true;
      continue;
    }

    // If we find a quote, we should toggle the string flag.
    else if (char === '"') {
      isInString = !isInString;
      continue;
    }

    // If we're starting a new argument, we should add it to the array.
    if (willStartNewArg) {
      args.push(char);
      willStartNewArg = false;
    }
    // Otherwise, add it to the last argument.
    else {
      args[args.length - 1] += char;
    }
  }

  if (isInString) {
    throw new Error("Unterminated string");
  }

  return args;
};

/**
 * Get the node options from the environment variable `NODE_OPTIONS` and returns
 * them as an array of strings.
 *
 * @returns An array of strings with the node options.
 */
const getNodeOptionsArgs = () => {
  if (!process.env.NODE_OPTIONS) return [];

  return tokenizeArgs(process.env.NODE_OPTIONS);
};

/**
 * Stringify the arguments to be used in a command line. It will ignore any
 * argument that has a value of `undefined`.
 *
 * @param args - The arguments to be stringified.
 * @returns A string with the arguments.
 */
export function formatNodeOptions(
  args: Record<string, string | boolean | undefined>
): string {
  return Object.entries(args)
    .map(([key, value]) => {
      if (value === true) {
        return `--${key}`;
      }

      if (value) {
        return `--${key}=${
          // Values with spaces need to be quoted. We use JSON.stringify to
          // also escape any nested quotes.
          value.includes(" ") && !value.startsWith('"')
            ? JSON.stringify(value)
            : value
        }`;
      }

      return null;
    })
    .filter(arg => arg !== null)
    .join(" ");
}

/**
 * Get the node options from the `NODE_OPTIONS` environment variable and parse
 * them into an object without the inspect options.
 *
 * @returns An object with the parsed node options.
 */
export function getParsedNodeOptionsWithoutInspect() {
  const args = getNodeOptionsArgs();
  if (args.length === 0) return {};

  const parsed = parseNodeArgs(args);

  // Remove inspect options.
  delete parsed.inspect;
  delete parsed["inspect-brk"];
  delete parsed.inspect_brk;

  return parsed;
}

/**
 * Get the node options from the `NODE_OPTIONS` environment variable and format
 * them into a string without the inspect options.
 *
 * @returns A string with the formatted node options.
 */
export function getFormattedNodeOptionsWithoutInspect() {
  const args = getParsedNodeOptionsWithoutInspect();
  if (Object.keys(args).length === 0) return "";

  return formatNodeOptions(args);
}

/**
 * Returns the package registry using the user's package manager. The URL will have a trailing slash.
 *
 * @param baseDir - The base directory to detect the package manager from.
 * @returns The package registry URL with a trailing slash.
 * @throws Will throw an error if the package manager cannot be detected or if the registry cannot be retrieved.
 */
export async function getRegistry(baseDir?: string) {
  const workspaceRoot = getWorkspaceRoot(baseDir);
  const pkgManager = await detectPackageManager(workspaceRoot);

  // Since `npm config` command fails in npm workspace to prevent workspace config conflicts,
  // add `--no-workspaces` flag to run under the context of the root project only.
  // Safe for non-workspace projects as it's equivalent to default `--workspaces=false`.
  // x-ref: https://github.com/vercel/next.js/issues/47121#issuecomment-1499044345
  // x-ref: https://github.com/npm/statusboard/issues/371#issue-920669998
  const resolvedFlags = pkgManager === "npm" ? "--no-workspaces" : "";
  let registry = `https://registry.npmjs.org/`;

  try {
    const output = execSync(
      `${pkgManager} config get registry ${resolvedFlags}`,
      {
        env: {
          ...process.env,
          NODE_OPTIONS: getFormattedNodeOptionsWithoutInspect()
        }
      }
    )
      .toString()
      .trim();

    if (output.startsWith("http")) {
      registry = output.endsWith("/") ? output : `${output}/`;
    }
  } catch (err) {
    throw new Error(`Failed to get registry from "${pkgManager}".`, {
      cause: err
    });
  }

  return registry;
}
