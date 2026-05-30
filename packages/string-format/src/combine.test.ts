import { describe, expect, it } from "vitest";
import { combine } from "./combine.ts";

describe("combine.ts", () => {
  it("joins two strings with a space", () => {
    expect(combine("hello", "world")).toBe("hello world");
  });
});
