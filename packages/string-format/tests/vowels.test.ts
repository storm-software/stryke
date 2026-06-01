import { describe, expect, it } from "vitest";
import { getIndefiniteArticle, isVowel } from "../src/vowels.ts";

describe("vowels.ts", () => {
  it("detects vowel-starting strings", () => {
    expect(isVowel("apple")).toBe(true);
    expect(isVowel("banana")).toBe(false);
  });

  it("returns the correct indefinite article", () => {
    expect(getIndefiniteArticle("orange")).toBe("an");
    expect(getIndefiniteArticle("grape")).toBe("a");
  });
});
