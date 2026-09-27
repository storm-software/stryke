import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import * as moduleExports from "../src/runtime-checks.ts";

describe("runtime-checks.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });

  describe("browser compatibility (no runtime objects)", () => {
    let originalProcess: NodeJS.Process | undefined;
    let originalBun: unknown;
    let originalDeno: unknown;
    let originalFastly: unknown;
    let originalNetlify: unknown;
    let originalEdgeRuntime: unknown;

    beforeEach(() => {
      originalProcess = globalThis.process;
      originalBun = (globalThis as any).Bun;
      originalDeno = (globalThis as any).Deno;
      originalFastly = (globalThis as any).fastly;
      originalNetlify = (globalThis as any).Netlify;
      originalEdgeRuntime = (globalThis as any).EdgeRuntime;
    });

    afterEach(() => {
      if (originalProcess !== undefined) {
        Object.defineProperty(globalThis, "process", {
          value: originalProcess,
          writable: true,
          configurable: true
        });
      }
      if (originalBun !== undefined) {
        Object.defineProperty(globalThis, "Bun", {
          value: originalBun,
          writable: true,
          configurable: true
        });
      }
      if (originalDeno !== undefined) {
        Object.defineProperty(globalThis, "Deno", {
          value: originalDeno,
          writable: true,
          configurable: true
        });
      }
      if (originalFastly !== undefined) {
        Object.defineProperty(globalThis, "fastly", {
          value: originalFastly,
          writable: true,
          configurable: true
        });
      }
      if (originalNetlify !== undefined) {
        Object.defineProperty(globalThis, "Netlify", {
          value: originalNetlify,
          writable: true,
          configurable: true
        });
      }
      if (originalEdgeRuntime !== undefined) {
        Object.defineProperty(globalThis, "EdgeRuntime", {
          value: originalEdgeRuntime,
          writable: true,
          configurable: true
        });
      }
    });

    it("returns safe defaults when runtime objects are undefined", async () => {
      Object.defineProperty(globalThis, "process", {
        value: undefined,
        writable: true,
        configurable: true
      });
      Object.defineProperty(globalThis, "Bun", {
        value: undefined,
        writable: true,
        configurable: true
      });
      Object.defineProperty(globalThis, "Deno", {
        value: undefined,
        writable: true,
        configurable: true
      });
      Object.defineProperty(globalThis, "fastly", {
        value: undefined,
        writable: true,
        configurable: true
      });
      Object.defineProperty(globalThis, "Netlify", {
        value: undefined,
        writable: true,
        configurable: true
      });
      Object.defineProperty(globalThis, "EdgeRuntime", {
        value: undefined,
        writable: true,
        configurable: true
      });

      vi.resetModules();
      const {
        isNode,
        isBun,
        isDeno,
        isFastly,
        isNetlify,
        isEdgeLight,
        isRuntimeClient,
        isRuntimeServer
      } = await import("../src/runtime-checks.ts");

      expect(isNode).toBe(false);
      expect(isBun).toBe(false);
      expect(isDeno).toBe(false);
      expect(isFastly).toBe(false);
      expect(isNetlify).toBe(false);
      expect(isEdgeLight).toBe(false);
      expect(isRuntimeClient).toBe(true);
      expect(isRuntimeServer).toBe(false);
    });
  });
});
