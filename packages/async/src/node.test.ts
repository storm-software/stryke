import { describe, expect, it } from "vitest";
import * as moduleExports from "./node.ts";

describe("node.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
