import { describe, expect, it } from "vitest";
import * as moduleExports from "./create-options.ts";

describe("create-options.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
