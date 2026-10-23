# 0008 — Optional light theme; dark stays the default

Date: 2026-10-23 · Status: accepted · PRD §7.1

## Decision
- Dark is the default for everyone, regardless of `prefers-color-scheme` (Lucky's call). Light
  applies only when the visitor turns it on with the sun/moon toggle (top bar on the home
  page, and the dock everywhere). The button uses `aria-pressed`.
- The choice lives in `localStorage` (`veek-theme`). A small static script in `<head>` sets
  `<html data-theme="light">` before first paint, so a returning visitor never sees a flash.
- The script is allowed by a SHA-256 hash in the CSP (computed once per isolate in
  `workers/security-headers.ts`) rather than the per-request nonce, so edge-cached HTML stays
  identical for every visitor and the theme never varies the cache.
- Light palette: `--color-bg #F5F4F0`, surface `#FFFFFF`, text `#111113`, muted `#55555C`.
  New role tokens keep both themes correct: `--color-accent-text` (lime in dark, `#4D6600` in
  light), `--color-focus`, `--color-danger`, `--color-grid-line`. Lime remains a fill.
- The home Writing section gets `.paper-flip`: in light mode its paper tokens become the dark
  palette, keeping the "new chapter" contrast. `/writing` stays a paper page in both themes.
- axe runs against both themes in e2e.
