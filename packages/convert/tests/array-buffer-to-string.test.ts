import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/array-buffer-to-string.ts";

describe("array-buffer-to-string.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
