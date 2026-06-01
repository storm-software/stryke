import { describe, expect, it } from "vitest";
import { list } from "../src/list.ts";

describe("list.ts", () => {
  it("formats single and multiple items", () => {
    expect(list("apple")).toBe("apple");
    expect(list(["apple", "banana"])).toBe("apple and banana");
    expect(list(["apple", "banana", "cherry"])).toBe("apple, banana, and cherry");
  });

  it("supports a custom conjunction", () => {
    expect(list(["apple", "banana"], { conjunction: "or" })).toBe("apple or banana");
  });
});
