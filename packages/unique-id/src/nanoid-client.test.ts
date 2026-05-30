import { afterEach, describe, expect, it, vi } from "vitest";
import { nanoid } from "./nanoid-client.ts";

describe("nanoid-client.ts", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("generates a stable id shape when randomness is stubbed", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);

    expect(nanoid(5)).toBe("00000");
  });
});
