import { describe, expect, it } from "vitest";
import { upperCaseFirst } from "./upper-case-first.ts";

describe("upperCaseFirst", () => {
  it.each([
    ["hello", "Hello"],
    ["hELLO", "HELLO"],
    ["Hello", "Hello"],
    ["1value", "1value"]
  ])("formats %s to %s", (input, expected) => {
    expect(upperCaseFirst(input)).toBe(expected);
  });

  it("returns undefined when input is undefined", () => {
    expect(upperCaseFirst(undefined)).toBeUndefined();
  });
});
