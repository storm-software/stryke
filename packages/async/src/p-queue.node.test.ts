import { describe, expect, it } from "vitest";
import * as moduleExports from "./p-queue.node.ts";

describe("p-queue.node.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
