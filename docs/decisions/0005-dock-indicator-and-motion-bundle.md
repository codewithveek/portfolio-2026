# 0005 — Dock active indicator uses clip-path; reveals are CSS-driven

Date: 2026-10-22 · Status: accepted · PRD §8.4, §12.2

## Decision
- `active-indicator` animates `clip-path` on one background layer instead of Motion's
  `layoutId`. `layoutId` needs Motion's `domMax` feature bundle; `domAnimation` (smaller) is
  what PRD §12.2 asks for.
- Triggered patterns (`fade-up`, `blur-in`, `mask-reveal`, `line-draw`) are CSS transitions
  driven by one shared `IntersectionObserver` and gated on `<html data-motion-ready>`. Elements
  already on screen at hydration are marked visible first, so nothing the server painted ever
  disappears. Values mirror `motion-tokens.ts`; a unit test keeps them in sync.
- Scroll-linked patterns use Motion (`useScroll`/`useTransform`) and render static until
  hydration.

## Known gap
The home page's initial JavaScript is about 175 KB gzip against the 140 KB budget. React DOM
and React Router are about 110 KB of that. Next steps: measure with the bundle visualiser, defer
the word-swap and work-stack Motion code until those sections approach the viewport.
