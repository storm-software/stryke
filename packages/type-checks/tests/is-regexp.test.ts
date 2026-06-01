import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/is-regexp.ts";

describe("is-regexp.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
