import { describe, expect, it } from "vitest";
import * as moduleExports from "./install.ts";

describe("install.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
