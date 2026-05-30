import { describe, expect, it } from "vitest";
import * as moduleExports from "./format-data-uri.ts";

describe("format-data-uri.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
