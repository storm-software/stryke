import { describe, expect, it } from "vitest";
import * as moduleExports from "./type-detect.ts";

describe("type-detect.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
