import { describe, expect, it } from "vitest";
import { deburr } from "./deburr.ts";

describe("deburr.ts", () => {
  it("removes accents from strings", () => {
    expect(deburr("Crème brûlée")).toBe("Creme brulee");
    expect(deburr("München")).toBe("Munchen");
  });
});
