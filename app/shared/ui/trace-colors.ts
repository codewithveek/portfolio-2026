/**
 * Trace bar colours by depth. Shallow bars are bright lime with dark text; deeper bars fade
 * towards the surface and switch to light text so labels keep AA contrast (PRD §12.1).
 */
export function traceBarMix(depth: number): number {
  return depth >= 2 ? 52 - depth * 8 : 100 - depth * 16;
}

export function traceTextClass(depth: number): string {
  return depth >= 2 ? "text-text" : "text-accent-ink";
}
