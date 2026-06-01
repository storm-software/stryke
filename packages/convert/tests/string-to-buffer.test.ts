import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/string-to-buffer.ts";

describe("string-to-buffer.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
