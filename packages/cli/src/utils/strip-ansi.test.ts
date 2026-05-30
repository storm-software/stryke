import { describe, expect, it } from "vitest";
import * as moduleExports from "./strip-ansi.ts";

describe("utils/strip-ansi.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
