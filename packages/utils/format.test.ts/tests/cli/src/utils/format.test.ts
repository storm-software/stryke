import { describe, expect, it } from "vitest";
import * as moduleExports from "./format.ts";

describe("utils/format.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
