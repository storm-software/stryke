import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/use-hover.ts";

describe("use-hover.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
