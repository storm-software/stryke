import { describe, expect, it } from "vitest";
import { findFileDotExtension, findFileExtension, findFileName, findFilePath, findFolderName } from "./find.ts";

describe("find.ts", () => {
  it("re-exports the file path helpers", () => {
    expect(findFileName("/home/user/file.ts")).toBe("file.ts");
    expect(findFilePath("/home/user/file.ts")).toBe("/home/user");
    expect(findFolderName("/home/user/file.ts")).toBe("user");
    expect(findFileExtension("file.d.ts", { fullExtension: true })).toBe("d.ts");
    expect(findFileDotExtension("file.ts")).toBe(".ts");
  });
});
