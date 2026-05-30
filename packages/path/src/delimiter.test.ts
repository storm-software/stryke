import { describe, expect, it } from "vitest";
import * as moduleExports from "./delimiter.ts";

describe("delimiter.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
