import { env } from "cloudflare:workers";

import { readFormValues, type ContactResult } from "./contact-schema";
import { createD1ContactStore } from "./contact-store.server";
import { handleContactSubmission } from "./handle-contact-submission.server";

/**
 * The form only accepts messages when it can keep them: a D1 binding and an inbox secret.
 * Otherwise visitors are told to email instead of seeing a success that loses their message.
 */
function isContactConfigured(): boolean {
  const database: unknown = env.DB;
  const hasDatabase =
    typeof database === "object" &&
    database !== null &&
    "prepare" in database &&
    typeof database.prepare === "function";
  return hasDatabase && Boolean(env.CONTACT_INBOX);
}

/** Wires the contact handler to the Worker's bindings for one request. */
export async function processContactRequest(request: Request): Promise<ContactResult> {
  const formData = await request.formData();
  if (!isContactConfigured()) {
    return { status: "rejected", reason: "unavailable", values: readFormValues(formData) };
  }
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
