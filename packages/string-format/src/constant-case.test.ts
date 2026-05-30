import { describe, expect, it } from "vitest";
import { constantCase, isConstantCase } from "./constant-case.ts";

describe("constantCase", () => {
  it.each([
    ["hello world", "HELLO_WORLD"],
    ["hello-world", "HELLO_WORLD"],
    ["hello_world", "HELLO_WORLD"],
    ["already_CONSTANT", "ALREADY_CONSTANT"]
  ])("formats %s to %s", (input, expected) => {
    expect(constantCase(input)).toBe(expected);
  });

  it("returns undefined when input is undefined", () => {
    expect(constantCase(undefined)).toBeUndefined();
  });
});

describe("isConstantCase", () => {
  it.each([
    ["HELLO_WORLD", true],
    ["HELLO_2_WORLD", true],
    ["hello_world", false],
    ["HelloWorld", false],
    [undefined, false]
  ])("returns %s for %s", (input, expected) => {
    expect(isConstantCase(input)).toBe(expected);
  });
});
