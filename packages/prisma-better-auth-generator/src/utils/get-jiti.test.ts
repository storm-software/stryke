import { describe, expect, it } from "vitest";
import * as moduleExports from "./get-jiti.ts";

describe("utils/get-jiti.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
