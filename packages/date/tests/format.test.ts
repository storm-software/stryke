import { describe, expect, it } from "vitest";

import {
  formatDate,
  formatDDMMYYYYCompact,
  formatMMDDYYYYCompact,
  formatYYYYMMDDCompact,
  formatYYYYMMDDHHmmss,
  formatYYYYMMDDTHHMMSS
} from "../src/format.ts";

describe("format date helpers", () => {
  const date = new Date(2024, 0, 15, 13, 45, 30);

  it("formats compact date strings", () => {
    expect(formatYYYYMMDDCompact(date)).toBe("20240115");
    expect(formatMMDDYYYYCompact(date)).toBe("01152024");
    expect(formatDDMMYYYYCompact(date)).toBe("15012024");
  });

  it("formats date time strings", () => {
    expect(formatYYYYMMDDHHmmss(date)).toBe("2024-01-15 13:45:30");
    expect(formatYYYYMMDDTHHMMSS(date)).toBe("2024-01-15T13:45:30");
  });

  it("supports additional string formats", () => {
    expect(formatDate(date, "YYYY/MM/DD")).toBe("2024/01/15");
    expect(formatDate(date, "MM/DD/YYYY")).toBe("01/15/2024");
    expect(formatDate(date, "DD/MM/YYYY")).toBe("15/01/2024");
    expect(formatDate(date, "YYYY.MM.DD")).toBe("2024.01.15");
    expect(formatDate(date, "MM.DD.YYYY")).toBe("01.15.2024");
    expect(formatDate(date, "DD.MM.YYYY")).toBe("15.01.2024");
    expect(formatDate(date, "YYYYMMDD")).toBe("20240115");
    expect(formatDate(date, "MMDDYYYY")).toBe("01152024");
    expect(formatDate(date, "DDMMYYYY")).toBe("15012024");
    expect(formatDate(date, "YYYY-MM-DD HH:mm:ss")).toBe("2024-01-15 13:45:30");
    expect(formatDate(date, "YYYY-MM-DDTHH:mm:ss")).toBe("2024-01-15T13:45:30");
  });

  it("throws for unsupported formats", () => {
    expect(() =>
      formatDate(date, "unsupported-format" as unknown as "YYYY-MM-DD")
    ).toThrow("Unsupported date format: unsupported-format");
  });
});
