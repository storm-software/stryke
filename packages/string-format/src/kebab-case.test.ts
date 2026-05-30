import { describe, expect, it } from "vitest";
import { isKebabCase, kebabCase } from "./kebab-case.ts";

describe("kebabCase", () => {
  it.each([
    ["Hello World", "hello-world"],
    ["hello_world", "hello-world"],
    ["already-kebab-case", "already-kebab-case"],
    ["camelCaseInput", "camel-case-input"]
  ])("formats %s to %s", (input, expected) => {
    expect(kebabCase(input)).toBe(expected);
  });

  it("returns undefined when input is undefined", () => {
    expect(kebabCase(undefined)).toBeUndefined();
  });
});

describe("isKebabCase", () => {
  it.each([
    ["kebab-case", true],
    ["kebab-2-case", true],
    ["Kebab-Case", false],
    ["snake_case", false],
    [undefined, false]
  ])("returns %s for %s", (input, expected) => {
    expect(isKebabCase(input)).toBe(expected);
  });
});
