import { describe, expect, it } from "vitest";
import * as moduleExports from "./articles.ts";

describe("articles.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
