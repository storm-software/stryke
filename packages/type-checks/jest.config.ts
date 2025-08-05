import { declarePackage } from "@storm-software/testing-tools/jest/declare-package";

export default declarePackage({
  projectRoot: "packages/type-checks",
  isNode: false,
  displayName: "type-checks"
});
