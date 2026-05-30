import { describe, expect, it } from "vitest";
import { join, joinPaths } from "./join-paths.ts";

describe("join-paths.ts", () => {
  it("joins relative segments into a normalized path", () => {
    expect(joinPaths("folder1", "folder2", "..", "folder3", "file.txt")).toBe("folder1/folder3/file.txt");
  });

  it("normalizes windows and absolute segments", () => {
    expect(joinPaths("C:\\", "Users", "Public", "..", "Documents", "file.txt")).toBe("C:/Users/Documents/file.txt");
    expect(join("/root", "folder", ".", "subfolder", "file.txt")).toBe("/root/folder/subfolder/file.txt");
  });
});
