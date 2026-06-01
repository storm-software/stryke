import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/to-path.ts";

describe("to-path.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
