import { describe, expect, it } from "vitest";

import {
  containsPlaceholder,
  placeholderSafe,
  stripPlaceholders,
  withoutPlaceholders,
} from "./placeholder";

describe("[Lucky] placeholders", () => {
  const rows = [{ role: "Founder" }, { role: "[Lucky] role" }];

  it("finds placeholders in nested values", () => {
    expect(containsPlaceholder({ deep: ["ok", { value: "[Lucky]" }] })).toBe(true);
    expect(containsPlaceholder({ deep: ["ok"] })).toBe(false);
  });

  it("removes placeholders in production and keeps them in development", () => {
    expect(withoutPlaceholders(rows, false)).toEqual([{ role: "Founder" }]);
    expect(withoutPlaceholders(rows, true)).toHaveLength(2);
    expect(placeholderSafe("[Lucky] link", false)).toBeUndefined();
    expect(placeholderSafe("https://cal.com/x", false)).toBe("https://cal.com/x");
  });

  it("strips placeholders from nested loader data", () => {
    const project = {
      role: "[Lucky] role",
      next: ["Ship v2", "[Lucky] next"],
      decisions: [{ because: "[Lucky]" }],
    };
    expect(stripPlaceholders(project, false)).toEqual({
      role: "",
      next: ["Ship v2"],
      decisions: [],
    });
    expect(stripPlaceholders(project, true)).toBe(project);
  });
});
