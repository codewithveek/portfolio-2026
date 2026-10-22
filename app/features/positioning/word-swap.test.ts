import { describe, expect, it } from "vitest";

import { parseHighlightStatement } from "~/shared/motion/word-highlight";

import { progressToStatementIndex } from "./word-swap";

describe("pinned word swap", () => {
  it("maps progress to floor(progress × 4), clamped", () => {
    expect(progressToStatementIndex(-0.2)).toBe(0);
    expect(progressToStatementIndex(0.24)).toBe(0);
    expect(progressToStatementIndex(0.5)).toBe(2);
    expect(progressToStatementIndex(1)).toBe(3);
  });
});

describe("word highlight parsing", () => {
  it("marks keywords that span several words", () => {
    const words = parseHighlightStatement("the *webhook* at *2 a.m.* today");
    expect(words.filter((word) => word.isKeyword).map((word) => word.text)).toEqual([
      "webhook",
      "2",
      "a.m.",
    ]);
  });
});
