import { describe, expect, it } from "vitest";
import * as moduleExports from "./shared.ts";

describe("shared.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
