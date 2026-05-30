import { describe, expect, it } from "vitest";
import * as moduleExports from "./is-root-dir.ts";

describe("is-root-dir.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
