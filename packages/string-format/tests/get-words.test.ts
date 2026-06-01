import { describe, expect, it } from "vitest";
import { CASE_SPLIT_PATTERN, RELAXED_SPLIT_PATTERN, getWords } from "../src/get-words.ts";

describe("get-words.ts", () => {
  it("splits mixed-case identifiers into words", () => {
    expect(getWords("camelCaseHTTPRequest")).toEqual(["camel", "Case", "HTTP", "Request"]);
  });

  it("supports relaxed splitting patterns", () => {
    expect(getWords("foo/bar-baz", { relaxed: true })).toEqual(["foo/bar-baz"]);
  });

  it("exposes the split patterns", () => {
    expect(CASE_SPLIT_PATTERN).toBeInstanceOf(RegExp);
    expect(RELAXED_SPLIT_PATTERN).toBeInstanceOf(RegExp);
  });
});
