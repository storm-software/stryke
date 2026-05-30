import { describe, expect, it } from "vitest";
import * as moduleExports from "./code-frames.ts";

describe("utils/code-frames.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
