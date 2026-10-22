/**
 * Motion tokens (PRD §8.3). The single source of truth for durations and easings.
 * CSS mirrors these as custom properties in `app/styles/motion.css`; a unit test keeps them in sync.
 */
export const easing = {
  outExpo: [0.16, 1, 0.3, 1], // default for entrances (reference site's main curve)
  inOutCubic: [0.65, 0, 0.35, 1], // two-way state changes
  outQuart: [0.25, 1, 0.5, 1], // small UI feedback
} as const;

export const duration = {
  instant: 0.12, // press feedback
  fast: 0.18, // hover, focus, toggles
  base: 0.45, // most entrances
  slow: 0.7, // headline reveals
  scenic: 1.2, // portrait settle
} as const;

export const stagger = { tight: 0.04, base: 0.08 } as const;

export const springs = {
  dock: { type: "spring", stiffness: 500, damping: 40 },
  cursorLabel: { type: "spring", stiffness: 550, damping: 45, mass: 0.6 },
} as const;

/** Viewport options for triggered patterns (PRD §8.4). */
export const triggeredViewport = { once: true, amount: 0.3 } as const;

export type EasingName = keyof typeof easing;

export function toCubicBezier(name: EasingName): string {
  return `cubic-bezier(${easing[name].join(", ")})`;
}
