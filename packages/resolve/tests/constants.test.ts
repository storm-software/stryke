import { describe, expect, expectTypeOf, it } from "vitest";
import {
  VALID_OBJECT_SOURCE_EXTENSIONS,
  type ValidObjectSourceExtension
} from "../src/constants";

describe("constants", () => {
  it("exports source extensions", () => {
    expect(Array.isArray(VALID_OBJECT_SOURCE_EXTENSIONS)).toBe(true);
    expect(VALID_OBJECT_SOURCE_EXTENSIONS.length).toBeGreaterThan(0);
    expect(VALID_OBJECT_SOURCE_EXTENSIONS).toContain("ts");
    expect(VALID_OBJECT_SOURCE_EXTENSIONS).toContain("json");
  });

  it("exposes a valid extension type", () => {
    const extension: ValidObjectSourceExtension = "ts";

    expect(extension).toBe("ts");
    expectTypeOf<ValidObjectSourceExtension>().toMatchTypeOf<string>();
  });
});
