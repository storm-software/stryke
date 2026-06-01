import { describe, expect, it } from "vitest";
import { delimiter, posix, win32 } from "../src/delimiter.ts";

describe("delimiter.ts", () => {
  it("exports the current platform delimiter", () => {
    expect(delimiter).toBe(":");
  });

  it("exposes platform proxies with fixed delimiters", () => {
    expect(posix.delimiter).toBe(":");
    expect(win32.delimiter).toBe(";");
  });
});
