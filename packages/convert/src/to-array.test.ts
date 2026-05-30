import { describe, expect, it } from "vitest";
import * as moduleExports from "./to-array.ts";

describe("to-array.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
