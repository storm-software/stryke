import { describe, expect, it } from "vitest";
import * as moduleExports from "./get-relative-path.ts";

describe("utils/get-relative-path.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
