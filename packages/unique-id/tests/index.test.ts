import { afterEach, describe, expect, it, vi } from "vitest";
import { nanoid, randomInteger, snowflake, uuid } from "../src/index.ts";

describe("index.ts", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("re-exports representative unique-id helpers", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);

    expect(uuid()).toBe("00000000-0000-4000-8000-000000000000");
    expect(nanoid(4)).toBe("0000");
    expect(randomInteger(10)).toBe(0);
    expect(typeof snowflake()).toBe("string");
  });
});
