# 0004 — OG images rendered with Playwright's Chromium instead of Satori

Date: 2026-10-22 · Status: accepted · PRD §9.8

## Context
PRD §9.8 suggests Satori + resvg. Fontsource ships Google Sans Flex only as variable woff2;
Satori reads neither woff2 nor variable axes, so the wide display caps (wdth 130–140) cannot be
reproduced without separately sourcing static TTF instances.

## Decision
`scripts/build-og-images.ts` renders each card as HTML in Playwright's Chromium (already a dev
dependency for e2e) and screenshots it at 1200×630 into `public/og/`. Same fonts, same tokens,
still build-time only, no runtime image generation.
