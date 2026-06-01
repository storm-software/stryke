import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/exists.ts";

describe("exists.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
