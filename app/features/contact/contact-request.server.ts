import { env } from "cloudflare:workers";

import type { ContactResult } from "./contact-schema";
import { createD1ContactStore } from "./contact-store.server";
import { handleContactSubmission } from "./handle-contact-submission.server";

/** Wires the contact handler to the Worker's bindings for one request. */
export async function processContactRequest(request: Request): Promise<ContactResult> {
  const formData = await request.formData();
  return handleContactSubmission({
    formData,
    clientIp: request.headers.get("CF-Connecting-IP") ?? "unknown",
    userAgent: request.headers.get("User-Agent") ?? "",
    dependencies: {
      store: createD1ContactStore(env.DB),
      emailBinding: env.EMAIL,
      rateLimiter: env.CONTACT_RATE_LIMITER,
      turnstileSecret: env.TURNSTILE_SECRET_KEY,
      contactInbox: env.CONTACT_INBOX,
      ipHashSalt: env.IP_HASH_SALT,
    },
  });
}
