import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { bundle } from "../src/bundle";

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
