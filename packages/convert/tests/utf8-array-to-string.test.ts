import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/utf8-array-to-string.ts";

describe("utf8-array-to-string.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
