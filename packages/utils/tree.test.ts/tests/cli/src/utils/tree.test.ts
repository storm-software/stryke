import { describe, expect, it } from "vitest";
import * as moduleExports from "./tree.ts";

describe("utils/tree.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
