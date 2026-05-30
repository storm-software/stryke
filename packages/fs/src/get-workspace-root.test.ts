import { describe, expect, it } from "vitest";
import * as moduleExports from "./get-workspace-root.ts";

describe("get-workspace-root.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
