import { describe, expect, it } from "vitest";
import * as moduleExports from "./find.ts";

describe("find.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
