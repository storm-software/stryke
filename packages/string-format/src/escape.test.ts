import { describe, expect, it } from "vitest";
import * as moduleExports from "./escape.ts";

describe("escape.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
