import { describe, expect, it } from "vitest";
import { titleCase } from "./title-case.ts";

describe("titleCase", () => {
  it.each([
    ["hello world", "Hello World"],
    ["hello-world", "Hello World"],
    ["hello_world", "Hello World"],
    ["helloWorld", "Hello World"],
    ["hello:world", "Hello - World"],
    ["c++ developer", "C +  +  Developer"]
  ])("formats %s to %s", (input, expected) => {
    expect(titleCase(input)).toBe(expected);
  });

  it("returns undefined when input is undefined", () => {
    expect(titleCase(undefined)).toBeUndefined();
  });
});
