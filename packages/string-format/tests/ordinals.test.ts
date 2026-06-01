import { describe, expect, it } from "vitest";
import { toOrdinal } from "../src/ordinals.ts";

describe("ordinals.ts", () => {
  it("formats common ordinal suffixes", () => {
    expect(toOrdinal(1)).toBe("1st");
    expect(toOrdinal(2)).toBe("2nd");
    expect(toOrdinal(3)).toBe("3rd");
    expect(toOrdinal(11)).toBe("11th");
  });
});
