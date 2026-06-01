import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getNonCryptoRandomValues,
  randomCharacters,
  randomInteger,
  randomLetter
} from "../src/random.ts";

describe("random.ts", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("generates deterministic values when Math.random is stubbed", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);

    expect(randomInteger(10)).toBe(0);
    expect(randomLetter()).toBe("a");
    expect(randomCharacters(4)).toBe("AAAA");
  });

  it("fills arrays with non-crypto random values", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);

    expect(getNonCryptoRandomValues(new Uint8Array(3))).toEqual(new Uint8Array([0, 0, 0]));
  });
});
