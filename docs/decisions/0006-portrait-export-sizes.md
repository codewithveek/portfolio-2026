# 0006 — Portrait exports stop at the source height

Date: 2026-10-22 · Status: accepted · PRD §7.5

The graded master is 1086×1448. `scripts/build-images.ts` exports 800 and 1200 px as asked and
caps the third size at the source height (1448 px) instead of upscaling to 1800 px. Replacing
`assets-src/portrait/original.png` with a ≥ 1800 px original and re-running the pipeline
produces the 1800 px export automatically. The 1200 px AVIF is 23 KB (budget 180 KB).
