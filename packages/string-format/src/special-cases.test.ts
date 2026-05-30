import { describe, expect, it } from "vitest";
import { SPECIAL_CASES } from "./special-cases.ts";

describe("special-cases.ts", () => {
  it("contains common special-case strings", () => {
    expect(SPECIAL_CASES).toContain("GitHub");
    expect(SPECIAL_CASES).toContain("OpenAI");
    expect(SPECIAL_CASES).toContain("YouTube");
  });
});
