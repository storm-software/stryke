import { describe, expect, it } from "vitest";
import * as moduleExports from "./get-prisma-internals.ts";

describe("utils/get-prisma-internals.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
