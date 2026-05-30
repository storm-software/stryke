import { describe, expect, it } from "vitest";
import { DEFAULT_ASSET_EXTS } from "./asset-extensions.ts";

describe("asset-extensions.ts", () => {
  it("exposes the default asset extension list", () => {
    expect(DEFAULT_ASSET_EXTS).toContain("png");
    expect(DEFAULT_ASSET_EXTS).toContain("mp4");
    expect(DEFAULT_ASSET_EXTS).toContain("zip");
  });
});
