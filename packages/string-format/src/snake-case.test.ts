import { describe, expect, it } from "vitest";
import { isSnakeCase, snakeCase } from "./snake-case.ts";

describe("snakeCase", () => {
  it.each([
    ["hello world", "hello_world"],
    ["hello-world", "hello_world"],
    ["helloWorld", "hello_world"],
    ["HELLO_WORLD", "hello_world"],
    ["already_snake_case", "already_snake_case"]
  ])("formats %s to %s", (input, expected) => {
    expect(snakeCase(input)).toBe(expected);
  });

  it("returns undefined when input is undefined", () => {
    expect(snakeCase(undefined)).toBeUndefined();
  });
});

describe("isSnakeCase", () => {
  it.each([
    ["snake_case", true],
    ["snake_2_case", true],
    ["SnakeCase", false],
    ["kebab-case", false],
    [undefined, false]
  ])("returns %s for %s", (input, expected) => {
    expect(isSnakeCase(input)).toBe(expected);
  });
});
