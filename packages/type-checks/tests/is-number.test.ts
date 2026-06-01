import { describe, expect, it } from "vitest";
import { isAnyNumber, isNumber } from "../src/is-number.ts";

describe("is-number.ts", () => {
  it("detects numbers and Number objects", () => {
    expect(isNumber(123)).toBe(true);
    expect(isNumber(new Number(123))).toBe(true);
    expect(isAnyNumber(new Number(123))).toBe(true);
    expect(isNumber("123")).toBe(false);
  });
});
