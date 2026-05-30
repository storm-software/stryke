import { describe, expect, it } from "vitest";
import * as moduleExports from "./join.ts";

describe("join.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
