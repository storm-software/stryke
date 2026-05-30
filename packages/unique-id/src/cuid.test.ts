import { describe, expect, it } from "vitest";
import { cuid } from "./cuid.ts";

describe("cuid.ts", () => {
  it("returns a lowercase alpha-numeric id", () => {
    const value = cuid();

    expect(value).toMatch(/^[a-z][A-Za-z0-9-]+$/);
    expect(value.length).toBeGreaterThan(20);
  });
});
