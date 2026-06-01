import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/is-empty-string.ts";

describe("is-empty-string.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
