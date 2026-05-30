import { describe, expect, it } from "vitest";
import * as moduleExports from "./use-keyboard-visible.ts";

describe("use-keyboard-visible.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
