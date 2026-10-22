import { describe, expect, it } from "vitest";

import { createUlid } from "./ulid";

describe("createUlid", () => {
  it("produces 26 Crockford characters that sort by time", () => {
    const earlier = createUlid(1_700_000_000_000);
    const later = createUlid(1_800_000_000_000);
    expect(earlier).toMatch(/^[0-9A-HJKMNP-TV-Z]{26}$/);
    expect(earlier < later).toBe(true);
  });
});
