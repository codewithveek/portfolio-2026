import { env } from "cloudflare:workers";

import { parseAnalyticsEvent, recordEvent } from "~/features/analytics/record-event.server";

import type { Route } from "./+types/events-action-route";

/** POST /api/events: analytics beacon (PRD §9.7). Unknown events are dropped silently. */
export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") return new Response(null, { status: 405 });
  let body: unknown;
  try {
    body = JSON.parse((await request.text()).slice(0, 2048));
  } catch {
    return new Response(null, { status: 204 });
  }
  const event = parseAnalyticsEvent(body);
  if (event) recordEvent(env.EVENTS, event);
  return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}

export function loader() {
  return new Response("Method Not Allowed", { status: 405, headers: { Allow: "POST" } });
}
