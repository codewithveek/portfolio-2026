# CLAUDE.md — veek.me 2026

Lucky Victory's portfolio. React Router v8 (framework mode) on Cloudflare Workers.

**Read `docs/prd.md` before starting any task.** It is the source of truth for scope, content, design tokens, motion and architecture. Reference sections by number in commits and PRs (for example `PRD §8.4`). If you change behaviour the PRD describes, update the PRD in the same PR.

## Working rules

- Work milestone by milestone (PRD §11). One feature branch and one PR per milestone. Open PRs only when asked; never push to `main` directly.
- **Never deploy to production or change DNS without Lucky's explicit go-ahead.** Preview uploads (`wrangler versions upload`) are fine.
- Never print secret values. Secrets go in `wrangler secret put` and `.dev.vars` (git-ignored); `.dev.vars.example` holds placeholders only.
- Never invent metrics, quotes or facts. Unknowns use a `[Lucky]` placeholder, which must not render in production (PRD §10.5).
- Features must work end to end, not just in the UI. Explain how non-obvious pieces work in the PR description.
- When you are unsure between two reasonable options, pick one, note it in `docs/decisions/` (short ADR), and move on.

## Code standards

- TypeScript `strict`, `noUncheckedIndexedAccess`. **No `any`** (use `unknown` and narrow). No non-null assertions without a comment explaining why.
- **Organise by feature/domain** (`app/features/<feature>/`), shared code in `app/shared/`. See PRD §9.6.
- **kebab-case for every file and folder name.**
- **Descriptive names.** No single-letter or vague names (`const f = 1`, `data2`, `handle`). Booleans read as questions (`isPinned`, `hasConsent`).
- **No god functions or components.** A component does one job; split when it passes ~150 lines or mixes data, layout and motion. Server logic lives in `*.server.ts` files.
- **Three or more parameters go in a typed options object.**
- Validate all external input with Zod (form data, env, fetched JSON, MDX frontmatter).
- Import from `react-router` and `react-router/dom` (v8 removed `react-router-dom`).
- Generate binding types with `wrangler types`; never hand-write `Env`.
- Prefer platform features over libraries (View Transitions, `IntersectionObserver`, CSS sticky).

## Motion rules (PRD §8)

- Content is visible in server HTML. No loaders, no intro gates, no hiding content until hydration. Initial hidden states apply only after `<html data-motion-ready>` is set on hydration.
- Animate only `transform`, `opacity`, `clip-path`, `filter`.
- Use tokens from `app/shared/motion/motion-tokens.ts`; no ad-hoc durations or easings.
- Every pattern has a reduced-motion behaviour. Lenis runs only on fine pointers without reduced motion.

## Commands

Set these up in M0 and keep this list accurate:

```bash
pnpm dev                # local dev in the Workers runtime
pnpm typecheck          # react-router typegen && tsc --noEmit
pnpm lint
pnpm test               # vitest
pnpm test:e2e           # playwright
pnpm build
pnpm content:fetch      # DEV articles + npm stats → app/content/generated/
pnpm images:build       # sharp exports for portrait and project media
pnpm db:generate        # drizzle-kit generate
pnpm db:migrate:local   # wrangler d1 migrations apply DB --local
pnpm og:build           # OG cards into public/og/ (Playwright Chromium)
pnpm screenshots        # design screenshots: node tools/screenshots/capture.ts <baseUrl> <outDir> [paths…]
```

In cloud sessions, set `PLAYWRIGHT_CHROMIUM=/opt/pw-browsers/chromium` for `test:e2e`, `og:build` and `screenshots`. `test:e2e` builds and serves the production bundle on port 4173; run `cp .dev.vars.example .dev.vars` first.

## Definition of done (every PR)

- Typecheck, lint, unit and e2e tests pass.
- New UI checked at 390 px and 1440 px, with reduced motion on and off, and with JavaScript disabled where the PRD requires it.
- No new axe serious/critical violations.
- PRD updated if behaviour changed.
