import { describe, expect, it } from "vitest";
import * as moduleExports from "./string-to-utf8-array.ts";

describe("string-to-utf8-array.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
