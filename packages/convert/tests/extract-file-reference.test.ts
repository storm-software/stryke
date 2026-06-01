import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/extract-file-reference.ts";

describe("extract-file-reference.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
