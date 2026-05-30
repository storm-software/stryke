import { describe, expect, it } from "vitest";
import * as moduleExports from "./deep-merge.ts";

describe("deep-merge.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
