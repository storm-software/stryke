import { declarePackage } from "@storm-software/testing-tools/jest/declare-package";

export default declarePackage(
  { projectRoot: "packages/hooks", isNode: false, displayName: "hooks"}
);
