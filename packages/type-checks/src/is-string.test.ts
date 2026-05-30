import { describe, expect, it } from "vitest";
import { isString } from "./is-string.ts";

describe("is-string.ts", () => {
  it("detects strings", () => {
    expect(isString("hello")).toBe(true);
    expect(isString(123)).toBe(false);
  });
});
