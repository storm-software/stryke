import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/get-unique.ts";

describe("get-unique.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
