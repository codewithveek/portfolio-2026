import { themeScript } from "../app/features/theme/theme-script";

let themeScriptHashPromise: Promise<string> | null = null;

/** CSP source for the static pre-paint theme script, computed once per isolate. */
export function getThemeScriptHash(): Promise<string> {
  themeScriptHashPromise ??= crypto.subtle
    .digest("SHA-256", new TextEncoder().encode(themeScript))
    .then((digest) => `'sha256-${btoa(String.fromCharCode(...new Uint8Array(digest)))}'`);
  return themeScriptHashPromise;
}

interface SecurityHeaderOptions {
  nonce: string;
  /** Extra script-src sources, e.g. the theme script's hash. */
  scriptHashes: readonly string[];
}

/** Security headers (PRD §9.9). */
export function buildContentSecurityPolicy({ nonce, scriptHashes }: SecurityHeaderOptions): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' ${scriptHashes.join(" ")} https://challenges.cloudflare.com https://static.cloudflareinsights.com`,
    "frame-src https://challenges.cloudflare.com",
    "img-src 'self' data:",
    "media-src 'self'",
    "font-src 'self'",
    "connect-src 'self' https://cloudflareinsights.com",
    "style-src 'self' 'unsafe-inline'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");
}

export function applySecurityHeaders(headers: Headers, options: SecurityHeaderOptions): void {
  headers.set("Content-Security-Policy", buildContentSecurityPolicy(options));
  headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
}

export function createNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return btoa(String.fromCharCode(...bytes));
}
