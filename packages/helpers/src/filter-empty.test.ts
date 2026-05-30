import { describe, expect, it } from "vitest";
import * as moduleExports from "./filter-empty.ts";

describe("filter-empty.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
