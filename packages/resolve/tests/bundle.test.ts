import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { bundle, toLoader } from "../src/bundle";

describe("toLoader", () => {
  it.each([
    ["js", "js"],
    ["cjs", "js"],
    ["mjs", "js"],
    ["jsx", "jsx"],
    ["ts", "ts"],
    ["cts", "ts"],
    ["mts", "ts"],
    ["tsx", "tsx"],
    ["json", "json"],
    ["css", "css"],
    ["", "ts"],
    ["unknown", "ts"]
  ] as const)("maps %s to %s", (extension, loader) => {
    expect(toLoader(extension)).toBe(loader);
  });
});

describe("bundle", () => {
  it("bundles an existing TypeScript module", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "stryke-resolve-bundle-"));

    try {
      const entryFile = join(tempDir, "entry.ts");
      await writeFile(entryFile, "export const answer = 42;\n", "utf8");

      const output = await bundle(entryFile);

      expect(output).toBeDefined();
      expect(output.text).toContain("answer");
      expect(output.text).toContain("42");
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("throws when the input file does not exist", async () => {
    await expect(bundle("/definitely/missing/file.ts")).rejects.toThrow(
      'Module not found: "/definitely/missing/file.ts"'
    );
  });
});
