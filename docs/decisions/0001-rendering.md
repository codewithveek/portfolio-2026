# 0001 — Rendering: SSR + edge cache, no prerendering

Date: 2026-10-22 · Status: accepted · PRD §9.2

## Context
PRD §9.2 makes prerendering optional and asks for a time-boxed spike. Cloudflare's guide says
prerendering is not supported with the Cloudflare Vite plugin apart from an experimental
`prerenderWorker` option.

## Decision
Every page is server-rendered (`ssr: true`) and cached at the edge in `workers/app.ts`
(`caches.default`, `s-maxage=86400`). The spike was **not run** in this build; nothing depends on
prerendering, and SSR already fixes the v5 "empty HTML" problem. Revisit only if TTFB on the
custom domain is a problem.

## Details
- The cache key includes `BUILD_ID` (set by CI) **and** a build ID baked in at build time
  (`import.meta.env.VITE_BUILD_ID`), so a new build can never serve old HTML even when the
  `BUILD_ID` var is left at its default. This was found when a local preview served HTML that
  pointed at deleted assets.
- Cached HTML carries the nonce of the render that produced it. On a cache hit, `HTMLRewriter`
  replaces every `nonce` attribute with the current request's nonce, and the CSP header uses
  the same new nonce.
- Development never uses the cache.
- The Cache API is a no-op on `workers.dev`; verify caching on the custom domain (M6).
