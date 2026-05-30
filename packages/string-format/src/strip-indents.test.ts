import { describe, expect, it } from "vitest";
import { stripIndents } from "./strip-indents.ts";

describe("strip-indents.ts", () => {
  it("trims indentation from template literals", () => {
    expect(stripIndents`
      Options:
      - one
      - two
    `).toBe("Options:\n- one\n- two");
  });
});
