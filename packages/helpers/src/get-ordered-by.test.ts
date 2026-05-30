import { describe, expect, it } from "vitest";
import * as moduleExports from "./get-ordered-by.ts";

describe("get-ordered-by.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
