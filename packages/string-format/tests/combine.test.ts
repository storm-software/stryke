import { describe, expect, it } from "vitest";
import { combine } from "../src/combine.ts";

describe("combine.ts", () => {
  it("joins two strings with a space", () => {
    expect(combine("hello", "world")).toBe("hello world");
  });
});
