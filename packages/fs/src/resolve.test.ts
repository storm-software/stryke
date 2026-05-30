import { describe, expect, it } from "vitest";
import * as moduleExports from "./resolve.ts";

describe("resolve.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
