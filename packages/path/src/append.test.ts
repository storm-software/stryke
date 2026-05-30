import { describe, expect, it } from "vitest";
import * as moduleExports from "./append.ts";

describe("append.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
