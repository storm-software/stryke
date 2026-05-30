import { describe, expect, it } from "vitest";
import {
  ABSOLUTE_PATH_REGEX,
  DRIVE_LETTER_REGEX,
  FILE_EXTENSION_REGEX,
  FULL_FILE_EXTENSION_REGEX,
  NPM_SCOPED_PACKAGE_REGEX,
  PACKAGE_PATH_REGEX,
  ROOT_FOLDER_REGEX,
  UNC_REGEX
} from "./regex.ts";

describe("regex.ts", () => {
  it("exposes the path regex constants", () => {
    expect(ABSOLUTE_PATH_REGEX.test("/home/user/project")).toBe(true);
    expect(DRIVE_LETTER_REGEX.test("C:")).toBe(true);
    expect(UNC_REGEX.test("\\\\server")).toBe(true);
    expect(ROOT_FOLDER_REGEX.test("/")).toBe(true);
    expect(FILE_EXTENSION_REGEX.test(".ts")).toBe(true);
    expect(FULL_FILE_EXTENSION_REGEX.test(".d.ts.map")).toBe(true);
    expect(PACKAGE_PATH_REGEX.test("@stryke/path/index.ts")).toBe(true);
    expect(NPM_SCOPED_PACKAGE_REGEX.test("@stryke/path")).toBe(true);
  });
});
