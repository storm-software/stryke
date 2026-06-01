import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/get-parent-path.ts";

describe("get-parent-path.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
