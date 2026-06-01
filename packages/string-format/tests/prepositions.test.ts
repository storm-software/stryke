import { describe, expect, it } from "vitest";
import { PREPOSITIONS } from "../src/prepositions.ts";

describe("prepositions.ts", () => {
  it("exposes the preposition list", () => {
    expect(PREPOSITIONS).toContain("about");
    expect(PREPOSITIONS).toContain("with respect to");
  });
});
