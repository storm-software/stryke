import { describe, expect, it } from "vitest";
import { camelCase, isCamelCase } from "./camel-case.ts";

describe("camelCase", () => {
  it.each([
    ["hello world", "helloWorld"],
    ["hello-world", "helloWorld"],
    ["hello_world", "helloWorld"],
    ["alreadyCamelCase", "alreadyCamelCase"],
    ["snake_case_and_more", "snakeCaseAndMore"]
  ])("formats %s to %s", (input, expected) => {
    expect(camelCase(input)).toBe(expected);
  });

  it("returns undefined when input is undefined", () => {
    expect(camelCase(undefined)).toBeUndefined();
  });
});

describe("isCamelCase", () => {
  it.each([
    ["camelCase", false],
    ["hello2World", false],
    ["PascalCase", false],
    ["kebab-case", false],
    [undefined, false]
  ])("returns %s for %s", (input, expected) => {
    expect(isCamelCase(input)).toBe(expected);
  });
});
