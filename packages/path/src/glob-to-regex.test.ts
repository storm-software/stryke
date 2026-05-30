import { describe, expect, it } from "vitest";
import { globToRegex } from "./glob-to-regex.ts";

describe("glob-to-regex.ts", () => {
  it("matches wildcard file extensions", () => {
    const regex = globToRegex("*.{js,ts}");

    expect(regex.test("index.ts")).toBe(true);
    expect(regex.test("index.js")).toBe(true);
    expect(regex.test("index.jsx")).toBe(false);
  });

  it("supports globstar path matching", () => {
    const regex = globToRegex("src/**");

    expect(regex.test("src/index.ts")).toBe(true);
    expect(regex.test("test/index.ts")).toBe(false);
  });
});
