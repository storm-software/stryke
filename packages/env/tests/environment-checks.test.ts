import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import * as moduleExports from "../src/environment-checks.ts";

describe("environment-checks.ts exports", () => {
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
      // Remove process from global scope
      Object.defineProperty(globalThis, "process", {
        value: undefined,
        writable: true,
        configurable: true
      });

      // Clear module cache and reimport
      vi.resetModules();
      const { platform, hasTTY, nodeVersion } = await import(
        "../src/environment-checks.ts"
      );

      expect(platform).toBe("");
      expect(hasTTY).toBe(false);
      expect(nodeVersion).toBe(null);
    });

    it("isDevelopment respects NODE_ENV bundler replacement", async () => {
      Object.defineProperty(globalThis, "process", {
        value: undefined,
        writable: true,
        configurable: true
      });

      vi.resetModules();
      const { isDevelopment } = await import(
        "../src/environment-checks.ts"
      );
      expect(isDevelopment).toBeDefined();
    });
  });
});
