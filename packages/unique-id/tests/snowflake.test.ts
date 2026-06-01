import { describe, expect, it } from "vitest";
import { deconstructSnowflake, isValidSnowflake, snowflake } from "../src/snowflake.ts";

describe("snowflake.ts", () => {
  it("generates a valid snowflake id with custom options", () => {
    const value = snowflake({ shardId: 3, timestamp: new Date("2021-01-01T00:00:00.000Z"), epoch: 0 });

    expect(isValidSnowflake(value)).toBe(true);
    expect(deconstructSnowflake(value).shard_id).toBe(3);
  });
});
