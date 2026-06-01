import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/prisma-generator.ts";

describe("prisma-generator.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
