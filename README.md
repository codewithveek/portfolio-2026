# veek.me (2026)

Portfolio of Lucky Victory Success — backend & full-stack engineer building payment systems, AI agent tooling and developer tools.

React Router v8 (framework mode, SSR) on Cloudflare Workers. The full spec is in [`docs/prd.md`](docs/prd.md); contributor rules (human or agent) are in [`CLAUDE.md`](CLAUDE.md); decisions are in [`docs/decisions/`](docs/decisions/).

## Run it

```bash
pnpm install
cp .dev.vars.example .dev.vars   # Turnstile test keys and placeholders
pnpm db:migrate:local            # local D1 for the contact form
pnpm dev                         # http://localhost:5173
```

Checks: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:e2e`. All commands are listed in `CLAUDE.md`.

## How it fits together

- **Pages** (`app/routes/`): `/`, `/work/:slug`, `/writing`, `/api/contact`, `/api/events`, `sitemap.xml`, `robots.txt`, 404. Every page is server-rendered; content is complete without JavaScript.
- **Worker** (`workers/app.ts`): canonical redirects, edge cache for content pages keyed by build, per-request CSP nonce (rewritten into cached HTML), security headers.
- **Content** (`app/content/`): case studies are MDX with Zod-validated frontmatter (invalid content fails the build); the DEV feed and npm stats are fetched into `generated/` by `pnpm content:fetch`. Facts still needed from Lucky are marked `[Lucky]`: visible in development, stripped from production HTML and loader data.
- **Motion** (`app/shared/motion/`): tokens in `motion-tokens.ts`; triggered reveals are CSS gated on `<html data-motion-ready>`; scroll-linked effects use Motion; Lenis only on fine pointers. Everything has a reduced-motion fallback.
- **Contact** (`app/features/contact/`): Zod validation, honeypot and timing check, Turnstile, rate limiting, D1 via Drizzle, then the `send_email` binding. A failed email never loses a message.

Status: live at https://veek.me (Cloudflare Worker `veek-portfolio`, cut over 2026-10-28; rollback steps in `docs/runbooks/cutover-rollback.md`). M5 partly done: voice note, résumé PDFs and the contact inbox are pending. Production deploys need Lucky's go-ahead.
