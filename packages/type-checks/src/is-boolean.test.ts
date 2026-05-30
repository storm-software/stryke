import { describe, expect, it } from "vitest";
import { isBoolean } from "./is-boolean.ts";

describe("is-boolean.ts", () => {
  it("detects booleans and Boolean objects", () => {
    expect(isBoolean(true)).toBe(true);
    expect(isBoolean(new Boolean(false))).toBe(true);
    expect(isBoolean(1)).toBe(false);
  });
});
