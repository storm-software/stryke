import { describe, expect, it } from "vitest";
import * as moduleExports from "./p-queue.ts";

describe("p-queue.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
