import { describe, expect, it } from "vitest";
import { isSetString } from "./is-set-string.ts";

describe("is-set-string.ts", () => {
  it("detects non-empty strings", () => {
    expect(isSetString("hello")).toBe(true);
    expect(isSetString("")).toBe(false);
    expect(isSetString(undefined)).toBe(false);
  });
});
