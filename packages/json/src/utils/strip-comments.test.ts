import { describe, expect, it } from "vitest";
import * as moduleExports from "./strip-comments.ts";

describe("utils/strip-comments.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
