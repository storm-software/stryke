import { describe, expect, it } from "vitest";
import * as moduleExports from "./format-file.ts";

describe("utils/format-file.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
