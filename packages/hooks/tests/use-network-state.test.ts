import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/use-network-state.ts";

describe("use-network-state.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
