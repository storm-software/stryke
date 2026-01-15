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

export interface TreeItem {
  name: string;
  children?: TreeItem[];
}

function innerFormatTree(
  tree: TreeItem,
  indent: string,
  isHead: boolean,
  isTail: boolean,
  result: string
): string {
  let entityPrefix = isTail === true ? "└── " : "├── ";
  let contentPrefix = isTail === true ? "    " : "│   ";
  if (isHead === true) {
    entityPrefix = "";
    contentPrefix = "";
  }

  result += `${indent + entityPrefix + tree.name}\n`;

  if (tree.children && tree.children.length > 0) {
    for (const [index, entity] of tree.children.entries()) {
      const isLast = index === tree.children.length - 1;
      result = innerFormatTree(
        entity,
        indent + contentPrefix,
        false,
        isLast,
        result
      );
    }
  }

  return result;
}

/**
 * Formats a tree structure into a string representation.
 *
 * ```ts
 * const tree: TreeItem = {
 *  name: "root",
 *  children: [
 *    { name: "child1" },
 *    { name: "child2", children: [ { name: "grandchild1" } ] }
 *  ];
 * };
 *
 * const formattedTree = formatTree(tree);
 * console.log(formattedTree);
 *
 * // Output:
 * // root
 * // ├── child1
 * // └── child2
 * //     └── grandchild1
 * ```
 *
 * @param tree - The root of the tree to format.
 * @returns A string representation of the tree structure.
 */
export function formatTree(tree: TreeItem): string {
  return innerFormatTree(tree, "", true, true, "");
}
