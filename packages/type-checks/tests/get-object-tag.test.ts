import { describe, expect, it } from "vitest";
import { getObjectTag } from "../src/get-object-tag.ts";

describe("get-object-tag.ts", () => {
  it("returns object tags for values", () => {
    expect(getObjectTag(undefined)).toBe("[object Undefined]");
    expect(getObjectTag(null)).toBe("[object Null]");
    expect(getObjectTag([])).toBe("[object Array]");
  });
});
