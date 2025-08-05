import { declarePackage } from "@storm-software/testing-tools/jest/declare-package";

export default declarePackage({
  projectRoot: "packages/prisma-trpc-generator",
  isNode: true,
  displayName: "prisma-trpc-generator"
});
