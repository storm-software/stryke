import { describe, expect, it } from "vitest";
import * as moduleExports from "./format-columns.ts";

describe("utils/format-columns.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
