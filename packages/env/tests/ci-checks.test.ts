import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import * as moduleExports from "../src/ci-checks.ts";

describe("ci-checks.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });

  describe("browser compatibility (no process object)", () => {
    let originalProcess: NodeJS.Process | undefined;

    beforeEach(() => {
      originalProcess = globalThis.process;
    });

    afterEach(() => {
      if (originalProcess !== undefined) {
        Object.defineProperty(globalThis, "process", {
          value: originalProcess,
          writable: true,
          configurable: true
        });
      }
    });

    it("returns safe defaults when process is undefined", async () => {
      Object.defineProperty(globalThis, "process", {
        value: undefined,
        writable: true,
        configurable: true
      });

      vi.resetModules();
      const { isCI, isInteractive } = await import("../src/ci-checks.ts");

      expect(isCI()).toBe(false);
      expect(isInteractive()).toBe(false);
    });
  });
});
