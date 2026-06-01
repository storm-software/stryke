import { afterEach, describe, expect, it, vi } from "vitest";
import { uuid } from "../src/uuid.ts";

describe("uuid.ts", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("generates a UUID v4-like string when randomness is stubbed", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);

    expect(uuid()).toBe("00000000-0000-4000-8000-000000000000");
  });
});
