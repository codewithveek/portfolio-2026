import { env } from "cloudflare:workers";
import { createRequestHandler, RouterContextProvider } from "react-router";

import { cspNonceContext } from "../app/shared/lib/request-context";
import { buildCacheKey, isCacheableRequest, isCacheableResponse, replaceNonce } from "./edge-cache";
import { applySecurityHeaders, createNonce } from "./security-headers";

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

/** Canonical host and no trailing slashes (PRD §5). */
function getCanonicalRedirect(request: Request): Response | null {
  const url = new URL(request.url);
  if (url.hostname === "www.veek.me") {
    url.hostname = "veek.me";
    return Response.redirect(url.toString(), 301);
  }
  if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.replace(/\/+$/, "");
    return Response.redirect(url.toString(), 301);
  }
  return null;
}

async function renderWithRouter(request: Request, nonce: string): Promise<Response> {
  const routerContext = new RouterContextProvider();
  routerContext.set(cspNonceContext, nonce);
  return requestHandler(request, routerContext);
}

function withHeaders(response: Response, nonce: string): Response {
  const mutable = new Response(response.body, response);
  applySecurityHeaders(mutable.headers, nonce);
  return mutable;
}

export default {
  async fetch(request, _env, executionContext) {
    const redirect = getCanonicalRedirect(request);
    if (redirect) return redirect;

    const nonce = createNonce();
    // Development renders fresh every time; the build ID never changes there.
    if (import.meta.env.DEV || !isCacheableRequest(request)) {
      return withHeaders(await renderWithRouter(request, nonce), nonce);
    }

    const cache = caches.default;
    const cacheKey = buildCacheKey(request, env.BUILD_ID);
    const cached = await cache.match(cacheKey);
    if (cached) {
      return withHeaders(replaceNonce(cached, nonce), nonce);
    }

    const rendered = await renderWithRouter(request, nonce);
    if (!isCacheableResponse(rendered)) return withHeaders(rendered, nonce);

    const response = new Response(rendered.body, rendered);
    response.headers.set("Cache-Control", "public, max-age=0, s-maxage=86400");
    executionContext.waitUntil(cache.put(cacheKey, response.clone()));
    return withHeaders(response, nonce);
  },
} satisfies ExportedHandler<Env>;
