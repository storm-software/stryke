import { declarePackage } from "@storm-software/testing-tools/jest/declare-package";

export default declarePackage({
  projectRoot: "packages/path",
  isNode: false,
  displayName: "path"
});
