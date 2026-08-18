import { afterEach, describe, expect, it } from "vitest";
import { getEnvPaths } from "../src/get-env-paths.ts";
import * as moduleExports from "../src/get-env-paths.ts";

describe("get-env-paths.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});

describe("getEnvPaths", () => {
  const originalPlatform = process.platform;
  const originalLocalAppData = process.env.LOCALAPPDATA;
  const originalAppData = process.env.APPDATA;
  const originalStormDataDir = process.env.STORM_DATA_DIR;

  afterEach(() => {
    Object.defineProperty(process, "platform", {
      configurable: true,
      value: originalPlatform
    });

    if (originalLocalAppData === undefined) {
      delete process.env.LOCALAPPDATA;
    } else {
      process.env.LOCALAPPDATA = originalLocalAppData;
    }

    if (originalAppData === undefined) {
      delete process.env.APPDATA;
    } else {
      process.env.APPDATA = originalAppData;
    }

    if (originalStormDataDir === undefined) {
      delete process.env.STORM_DATA_DIR;
    } else {
      process.env.STORM_DATA_DIR = originalStormDataDir;
    }
  });

  it("does not duplicate the Windows drive letter in the data directory", () => {
    Object.defineProperty(process, "platform", {
      configurable: true,
      value: "win32"
    });
    process.env.LOCALAPPDATA = "C:\\Users\\test\\AppData\\Local";
    process.env.APPDATA = "C:\\Users\\test\\AppData\\Roaming";
    delete process.env.STORM_DATA_DIR;

    const { data } = getEnvPaths();

    expect(data).toBe("C:/Users/test/AppData/Local/StormSoftware/Data");
    expect(data).not.toContain("C:/C:");
    expect(data.startsWith("/C:")).toBe(false);
  });

  it("collapses duplicated Windows drive prefixes from LOCALAPPDATA", () => {
    Object.defineProperty(process, "platform", {
      configurable: true,
      value: "win32"
    });
    process.env.LOCALAPPDATA = "C:/C:/Users/test/AppData/Local";
    process.env.APPDATA = "C:/Users/test/AppData/Roaming";
    delete process.env.STORM_DATA_DIR;

    expect(getEnvPaths().data).toBe(
      "C:/Users/test/AppData/Local/StormSoftware/Data"
    );
  });

  it("strips a leading slash before a Windows drive letter", () => {
    Object.defineProperty(process, "platform", {
      configurable: true,
      value: "win32"
    });
    process.env.LOCALAPPDATA = "/C:/Users/test/AppData/Local";
    process.env.APPDATA = "/C:/Users/test/AppData/Roaming";
    delete process.env.STORM_DATA_DIR;

    expect(getEnvPaths().data).toBe(
      "C:/Users/test/AppData/Local/StormSoftware/Data"
    );
  });
});
