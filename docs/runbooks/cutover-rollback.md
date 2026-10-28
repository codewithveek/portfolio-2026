# veek.me cutover (M6) and rollback

Cutover: 2026-10-28 ~10:12 UTC. `veek.me` and `www.veek.me` are Worker custom domains on
`veek-portfolio` (see `routes` in `wrangler.jsonc`). `www` 301-redirects to the apex in
`workers/app.ts`. Only the two Vercel web records were removed; email (MX, SPF, DKIM), `blog`,
`markwise`, `mybiz`, `cloud`, `medi`, `assets`, `cdn`, `wp-afriex` and the wildcard were not touched.

## Rollback to Vercel (PRD §11 M6: keep the Vercel project two weeks, until 2026-11-11)

1. Remove `routes` from `wrangler.jsonc` and run `wrangler deploy` (or delete the two custom
   domains under Workers & Pages → veek-portfolio → Settings → Domains & Routes).
2. Recreate the records saved in `vercel-dns-backup.json`, both DNS-only (not proxied):
   - `A veek.me 216.198.79.1`
   - `CNAME www.veek.me 884d80e9ae21bb8b.vercel-dns-017.com`
3. Check `curl -sI https://veek.me` shows `server: Vercel`.

After 2026-11-11, remove `veek.me` and `www.veek.me` from the Vercel project.
