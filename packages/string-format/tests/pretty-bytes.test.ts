import { describe, expect, it } from "vitest";
import { prettyBytes } from "../src/pretty-bytes.ts";

describe("pretty-bytes.ts", () => {
  it("formats bytes into a readable unit string", () => {
    expect(prettyBytes(1337)).toBe("1.34 kB");
  });

  it("supports signed formatting", () => {
    expect(prettyBytes(42, { signed: true })).toBe("+42 B");
  });

  it("supports binary units", () => {
    expect(prettyBytes(1024, { binary: true })).toBe("1 KiB");
  });
});
