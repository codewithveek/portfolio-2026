# 0003 — Generated trace covers until real project media exists

Date: 2026-10-22 · Status: accepted (temporary) · PRD §6.5, §7.6, §14 item 12

## Context
The work stack and case studies need media. Screenshots, SigNoz dashboards and the Cutroom
video are still open items. Stock or mocked screenshots would be invented facts.

## Decision
When `cover.image` is absent, the card renders the project's own `architecture` spans as a
trace/flame-graph cover (the §7.6 motif). It is honest, light (no image bytes) and on-brand.
Adding `cover.image` (and later `cover.video`) to a project's frontmatter replaces it.
