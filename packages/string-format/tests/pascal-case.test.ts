import { describe, expect, it } from "vitest";
import { isPascalCase, pascalCase } from "../src/pascal-case.ts";

describe("pascalCase", () => {
  it.each([
    ["hello world", "HelloWorld"],
    ["hello-world", "HelloWorld"],
    ["snake_case", "SnakeCase"],
    ["AlreadyPascal", "AlreadyPascal"]
  ])("formats %s to %s", (input, expected) => {
    expect(pascalCase(input)).toBe(expected);
  });

  it("returns undefined when input is undefined", () => {
    expect(pascalCase(undefined)).toBeUndefined();
  });
});

describe("isPascalCase", () => {
  it.each([
    ["PascalCase", true],
    ["Version2Value", false],
    ["camelCase", false],
    ["snake_case", false],
    [undefined, false]
  ])("returns %s for %s", (input, expected) => {
    expect(isPascalCase(input)).toBe(expected);
  });
});
