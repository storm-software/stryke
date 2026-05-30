import { describe, expect, it } from "vitest";
import * as moduleExports from "./match-sorter.ts";

describe("match-sorter.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
