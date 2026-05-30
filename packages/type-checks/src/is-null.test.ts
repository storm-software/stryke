import { describe, expect, it } from "vitest";
import { isNull } from "./is-null.ts";

describe("is-null.ts", () => {
  it("detects null values", () => {
    expect(isNull(null)).toBe(true);
    expect(isNull(undefined)).toBe(false);
  });
});
