import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/hash-files.ts";

describe("hash-files.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
