import { describe, expect, it } from "vitest";
import * as moduleExports from "./parse-error.ts";

describe("utils/parse-error.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
