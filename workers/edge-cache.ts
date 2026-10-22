/** Edge cache for content pages (PRD §9.2). */
const cacheablePathPatterns = [/^\/$/, /^\/work\/[a-z0-9-]+$/, /^\/writing$/];

export function isCacheableRequest(request: Request): boolean {
  if (request.method !== "GET") return false;
  const { pathname } = new URL(request.url);
  return cacheablePathPatterns.some((pattern) => pattern.test(pathname));
}

/** The build ID is part of the key, so a new deploy never serves stale pages. */
export function buildCacheKey(request: Request, buildId: string): Request {
  const url = new URL(request.url);
  url.searchParams.set("__build", buildId);
  return new Request(url.toString(), { method: "GET" });
}

export function isCacheableResponse(response: Response): boolean {
  return response.status === 200 && !response.headers.has("Set-Cookie");
}

/**
 * Cached HTML still carries the nonce of the render that produced it. Rewrite every nonce
 * attribute to this request's nonce so each response has its own (PRD §9.9).
 */
export function replaceNonce(response: Response, nonce: string): Response {
  return new HTMLRewriter()
    .on("[nonce]", {
      element(element) {
        element.setAttribute("nonce", nonce);
      },
    })
    .transform(response);
}
