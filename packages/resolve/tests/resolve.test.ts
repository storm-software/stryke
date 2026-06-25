import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  resolve,
  resolveFilePath,
  resolveGitHub,
  resolveGitLab,
  resolveSafe,
  resolveURL
} from "../src/resolve";

function createResponse(
  body: string,
  ok = true,
  status = 200,
  statusText = "OK"
) {
  return {
    ok,
    status,
    statusText,
    text: async () => body
  } as Response;
}

describe("resolveURL", () => {
  it("fetches content from a URL string", async () => {
    const fetch = async () => createResponse("url-result");

    await expect(
      resolveURL("https://example.com/file.ts", { fetch })
    ).resolves.toBe("url-result");
  });

  it("rejects URL objects that do not satisfy the internal URL type check", async () => {
    const fetch = async () => createResponse("url-object-result");

    await expect(
      resolveURL(new URL("https://example.com/file.ts"), { fetch })
    ).rejects.toThrow("is not a valid string or URL");
  });

  it("throws when URL string is invalid", async () => {
    await expect(resolveURL("not-a-url" as any)).rejects.toThrow(
      "is not a valid URL"
    );
  });

  it("throws for file URLs", async () => {
    await expect(resolveURL("file:///tmp/file.ts" as any)).rejects.toThrow(
      "is not a valid URL"
    );
  });

  it("throws when the response is not ok", async () => {
    const fetch = async () => createResponse("failed", false, 404, "Not Found");

    await expect(
      resolveURL("https://example.com/missing.ts", { fetch })
    ).rejects.toThrow("HTTP status: 404 Not Found");
  });
});

describe("resolveGitHub", () => {
  it("resolves a github reference through raw.githubusercontent.com", async () => {
    const calls: string[] = [];
    const fetch = async (input: string | URL | Request) => {
      calls.push(String(input));
      return createResponse("github-result");
    };

    const result = await resolveGitHub(
      "github:main:storm-software/stryke/packages/resolve/src/types.ts",
      { fetch }
    );

    expect(result).toBe("github-result");
    expect(calls[0]).toBe(
      "https://raw.githubusercontent.com/storm-software/stryke/main/packages/resolve/src/types.ts"
    );
  });
});

describe("resolveGitLab", () => {
  it("resolves a gitlab reference through gitlab.com raw route", async () => {
    const calls: string[] = [];
    const fetch = async (input: string | URL | Request) => {
      calls.push(String(input));
      return createResponse("gitlab-result");
    };

    const result = await resolveGitLab(
      "gitlab:master:storm-software/stryke/packages/resolve/src/types.ts",
      { fetch }
    );

    expect(result).toBe("gitlab-result");
    expect(calls[0]).toBe(
      "https://gitlab.com/storm-software/stryke/-/raw/master/packages/resolve/src/types.ts"
    );
  });
});

describe("resolveFilePath", () => {
  it("bundles and returns source content from a valid path", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "stryke-resolve-filepath-"));

    try {
      const entryFile = join(tempDir, "entry.ts");
      await writeFile(entryFile, "export const value = 'resolved';\n", "utf8");

      const result = await resolveFilePath(entryFile);

      expect(result).toContain("resolved");
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("throws when the path is invalid", async () => {
    await expect(resolveFilePath("")).rejects.toThrow(
      "is not a valid file path"
    );
  });
});

describe("resolve", () => {
  it("resolves URL input", async () => {
    const fetch = async () => createResponse("resolved-url");

    await expect(
      resolve("https://example.com/file.ts", { fetch })
    ).resolves.toBe("resolved-url");
  });

  it("resolves FileReference input", async () => {
    const fetch = async () => createResponse("resolved-ref");

    await expect(
      resolve({ file: "https://example.com/file.ts" } as any, { fetch })
    ).resolves.toBe("resolved-ref");
  });

  it("resolves GitHub reference input", async () => {
    const fetch = async () => createResponse("resolved-github");

    await expect(
      resolve(
        "github:main:storm-software/stryke/packages/resolve/src/types.ts",
        {
          fetch
        }
      )
    ).resolves.toBe("resolved-github");
  });

  it("resolves GitLab reference input", async () => {
    const fetch = async () => createResponse("resolved-gitlab");

    await expect(
      resolve(
        "gitlab:master:storm-software/stryke/packages/resolve/src/types.ts",
        {
          fetch
        }
      )
    ).resolves.toBe("resolved-gitlab");
  });

  it("resolves a file path", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "stryke-resolve-main-"));

    try {
      const entryFile = join(tempDir, "entry.ts");
      await writeFile(entryFile, "export const flag = true;\n", "utf8");

      const output = await resolve(entryFile);

      expect(output).toContain("flag");
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("throws when input cannot be resolved", async () => {
    await expect(resolve({ invalid: true } as any)).rejects.toThrow(
      "not a valid string, URL, or FileReference"
    );
  });
});

describe("resolveSafe", () => {
  it("returns resolved content when resolution succeeds", async () => {
    const fetch = async () => createResponse("safe-success");

    await expect(
      resolveSafe("https://example.com/file.ts", { fetch })
    ).resolves.toBe("safe-success");
  });

  it("returns undefined when resolution fails", async () => {
    await expect(resolveSafe("not-a-url" as any)).resolves.toBeUndefined();
  });
});
