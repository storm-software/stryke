import { describe, expect, it } from "vitest";
import * as moduleExports from "./stringify.ts";

describe("stringify.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
