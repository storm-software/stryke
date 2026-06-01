import { describe, expect, it } from "vitest";
import {
  findFileDotExtension,
  findFileDotExtensionSafe,
  findFileExtension,
  findFileExtensionSafe,
  findFileName,
  findFilePath,
  findFolderName,
  hasFileExtension,
  hasFileName,
  hasFilePath
} from "../src/file-path-fns.ts";

describe("file-path-fns.ts", () => {
  it("extracts file names and parent paths", () => {
    expect(findFileName("C:/Users/user/Documents/file.txt")).toBe("file.txt");
    expect(findFileName("C:/Users/user/Documents/file.txt", { withExtension: false })).toBe("file");
    expect(findFilePath("C:/Users/user/Documents/file.txt")).toBe("C:/Users/user/Documents");
    expect(findFolderName("C:/Users/user/Documents/file.txt")).toBe("Documents");
  });

  it("extracts file extensions in different forms", () => {
    expect(findFileExtension("file.config.ts")).toBe("ts");
    expect(findFileExtension("file.d.ts", { fullExtension: true })).toBe("d.ts");
    expect(findFileDotExtension("file.ts")).toBe(".ts");
    expect(findFileExtensionSafe("file")).toBe("");
    expect(findFileDotExtensionSafe("file")).toBe("");
  });

  it("detects file-related path traits", () => {
    expect(hasFileName("/home/user/file.ts")).toBe(true);
    expect(hasFilePath("/home/user/file.ts")).toBe(true);
    expect(hasFileExtension("/home/user/file.ts")).toBe(true);
  });
});
