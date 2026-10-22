import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { duration, easing, stagger } from "./motion-tokens";

const motionCss = readFileSync(new URL("../../styles/motion.css", import.meta.url), "utf8");

function readCssVariable(name: string): string | undefined {
  return new RegExp(`--${name}:\\s*([^;]+);`).exec(motionCss)?.[1]?.trim();
}

describe("motion tokens", () => {
  it("CSS custom properties mirror motion-tokens.ts", () => {
    expect(readCssVariable("motion-ease-out-expo")).toBe(
      `cubic-bezier(${easing.outExpo.join(", ")})`,
    );
    expect(readCssVariable("motion-ease-in-out-cubic")).toBe(
      `cubic-bezier(${easing.inOutCubic.join(", ")})`,
    );
    expect(readCssVariable("motion-ease-out-quart")).toBe(
      `cubic-bezier(${easing.outQuart.join(", ")})`,
    );
    for (const [name, seconds] of Object.entries(duration)) {
      expect(readCssVariable(`motion-duration-${name}`)).toBe(`${seconds}s`);
    }
    expect(readCssVariable("motion-stagger-base")).toBe(`${stagger.base}s`);
    expect(readCssVariable("motion-stagger-tight")).toBe(`${stagger.tight}s`);
  });
});
