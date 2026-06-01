import { describe, expect, it } from "vitest";
import { CONJUNCTIONS } from "../src/conjunctions.ts";

describe("conjunctions.ts", () => {
  it("contains common conjunctions", () => {
    expect(CONJUNCTIONS).toContain("and");
    expect(CONJUNCTIONS).toContain("because");
  });
});
