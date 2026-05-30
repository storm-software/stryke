import { describe, expect, it } from "vitest";
import * as moduleExports from "./use-battery.ts";

describe("use-battery.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
