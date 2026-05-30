import { describe, expect, it } from "vitest";
import * as moduleExports from "./get-object-tag.ts";

describe("get-object-tag.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
