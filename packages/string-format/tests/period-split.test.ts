import { describe, expect, it } from "vitest";
import { isPeriodSplit, periodSplit } from "../src/period-split.ts";

describe("period-split.ts", () => {
  it("detects already period-split strings", () => {
    expect(isPeriodSplit("this.is.an.example")).toBe(true);
    expect(isPeriodSplit("this_is_an_example")).toBe(false);
  });

  it("converts mixed strings into period-split form", () => {
    expect(periodSplit("thisIsAnExample")).toBe("this.is.an.example");
  });
});
