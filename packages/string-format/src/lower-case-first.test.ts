import { describe, expect, it } from "vitest";
import { lowerCaseFirst } from "./lower-case-first.ts";

describe("lowerCaseFirst", () => {
  it.each([
    ["Hello", "hello"],
    ["HELLO", "hELLO"],
    ["hello", "hello"],
    ["1value", "1value"]
  ])("formats %s to %s", (input, expected) => {
    expect(lowerCaseFirst(input)).toBe(expected);
  });

  it("returns undefined when input is undefined", () => {
    expect(lowerCaseFirst(undefined)).toBeUndefined();
  });
});
