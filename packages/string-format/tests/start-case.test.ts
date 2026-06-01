import { describe, expect, it } from "vitest";
import { isStartCase, startCase } from "../src/start-case.ts";

describe("startCase", () => {
  it.each([
    ["hello world", "Hello World"],
    ["hello-world", "Hello World"],
    ["hello_world", "Hello World"],
    ["already Start Case", "Already Start Case"],
    ["API response", "API Response"]
  ])("formats %s to %s", (input, expected) => {
    expect(startCase(input)).toBe(expected);
  });

  it("returns undefined when input is undefined", () => {
    expect(startCase(undefined)).toBeUndefined();
  });
});

describe("isStartCase", () => {
  it.each([
    ["Start Case", true],
    ["Single", true],
    ["start Case", false],
    ["start-case", false],
    [undefined, false]
  ])("returns %s for %s", (input, expected) => {
    expect(isStartCase(input)).toBe(expected);
  });
});
