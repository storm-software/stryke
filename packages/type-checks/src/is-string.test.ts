import { describe, expect, it } from "vitest";
import * as moduleExports from "./is-string.ts";

describe("is-string.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
