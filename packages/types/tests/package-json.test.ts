import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/package-json.ts";

describe("package-json.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
