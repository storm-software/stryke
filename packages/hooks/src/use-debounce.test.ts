import { describe, expect, it } from "vitest";
import * as moduleExports from "./use-debounce.ts";

describe("use-debounce.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
