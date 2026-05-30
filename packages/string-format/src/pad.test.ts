import { describe, expect, it } from "vitest";
import { pad } from "./pad.ts";

describe("pad.ts", () => {
  it("pads strings on both sides", () => {
    expect(pad("abc", 8)).toBe("  abc   ");
  });

  it("uses the provided padding characters", () => {
    expect(pad("abc", 8, "_-" )).toBe("_-abc_-_");
  });

  it("returns the input unchanged when no padding is needed", () => {
    expect(pad("abc", 2)).toBe("abc");
  });
});
