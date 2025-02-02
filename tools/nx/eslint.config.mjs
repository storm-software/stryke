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

import parser from "jsonc-eslint-parser";
import baseConfig from "../../eslint.config.mjs";

export default [
  ...baseConfig,
  {
    files: ["**/*.json"],
    rules: {
      "@nx/dependency-checks": [
        "error",
        {
          ignoredFiles: ["{projectRoot}/eslint.config.{js,cjs,mjs}"]
        }
      ]
    },
    languageOptions: {
      parser
    }
  },
  {
    "files": [
      "./package.json",
      "./generators.json",
      "./executors.json",
      "./generators.json",
      "./executors.json",
      "./migrations.json"
    ],
    rules: {
      "@nx/nx-plugin-checks": "error"
    },
    languageOptions: {
      parser
    }
  }
];
