import { data, redirect } from "react-router";

import { processContactRequest } from "~/features/contact/contact-request.server";

import type { Route } from "./+types/contact-action-route";

/** POST /api/contact (PRD §9.4). Never cached; GET is not allowed. */
export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") return data(null, { status: 405 });
  const result = await processContactRequest(request);
  // A plain form navigation (no JS) lands back on the page instead of on JSON.
  const isDocumentNavigation = request.headers.get("Sec-Fetch-Mode") === "navigate";
  if (isDocumentNavigation && result.status === "success") return redirect("/?sent=1#contact");
  if (isDocumentNavigation) return redirect("/#contact");
  const statusCode = result.status === "success" ? 200 : result.status === "invalid" ? 400 : 422;
  return data(result, { status: statusCode, headers: { "Cache-Control": "no-store" } });
}

export function loader() {
  return new Response("Method Not Allowed", { status: 405, headers: { Allow: "POST" } });
}
