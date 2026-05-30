import { describe, expect, it } from "vitest";
import { ARTICLES } from "./articles.ts";

describe("articles.ts", () => {
  it("exposes the article list", () => {
    expect(ARTICLES).toEqual(["a", "an", "the"]);
  });
});
