import { describe, expect, it } from "vitest";
import * as moduleExports from "./use-isomorphic-layout-effect.ts";

describe("use-isomorphic-layout-effect.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
