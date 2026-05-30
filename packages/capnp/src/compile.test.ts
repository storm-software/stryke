import { describe, expect, it } from "vitest";
import * as moduleExports from "./compile.ts";

describe("compile.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
