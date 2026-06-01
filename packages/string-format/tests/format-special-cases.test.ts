import { describe, expect, it } from "vitest";
import { formatSpecialCases } from "../src/format-special-cases.ts";

describe("format-special-cases.ts", () => {
  it("preserves special cases and acronyms", () => {
    expect(formatSpecialCases("GitHub", 1, ["Hello", "GitHub"])).toBe("GitHub");
    expect(formatSpecialCases("API", 1, ["Hello", "API"])).toBe("Application Programming Interface");
    expect(formatSpecialCases("API", 1, ["Hello", "API"], { useDescriptions: false })).toBe("API");
  });

  it("lowercases small joining words in the middle of titles", () => {
    expect(formatSpecialCases("and", 1, ["Hello", "and", "World"])).toBe("and");
    expect(formatSpecialCases("the", 1, ["Hello", "the", "World"])).toBe("the");
  });
});
