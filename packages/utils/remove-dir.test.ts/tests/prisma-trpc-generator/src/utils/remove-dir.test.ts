import { describe, expect, it } from "vitest";
import * as moduleExports from "./remove-dir.ts";

describe("utils/remove-dir.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
