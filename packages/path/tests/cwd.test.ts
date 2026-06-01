import { afterEach, describe, expect, it, vi } from "vitest";
import { cwd } from "../src/cwd.ts";

describe("cwd.ts", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the current working directory with normalized slashes", () => {
    vi.spyOn(process, "cwd").mockReturnValue("C:\\repo\\stryke");

    expect(cwd()).toBe("C:/repo/stryke");
  });

  it("falls back to the root path when cwd is unavailable", () => {
    const originalProcess = globalThis.process;

    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete (globalThis as typeof globalThis & { process?: typeof process }).process;

    expect(cwd()).toBe("/");

    globalThis.process = originalProcess;
  });
});
