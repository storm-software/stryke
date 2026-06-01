import { describe, expect, it } from "vitest";
import { isSystemRoot } from "../src/is-root-dir.ts";

describe("is-root-dir.ts", () => {
  it("returns true for the POSIX root directory", () => {
    expect(isSystemRoot("/")).toBe(true);
  });

  it("returns true for Windows root directories", () => {
    expect(isSystemRoot("C:\\")).toBe(true);
    expect(isSystemRoot("c:\\")).toBe(true);
  });

  it("returns false for non-root directories", () => {
    expect(isSystemRoot("/home/user")).toBe(false);
  });
});
