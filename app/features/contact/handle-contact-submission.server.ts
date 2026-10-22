import { hashIp } from "~/shared/lib/hash-ip.server";
import { createUlid } from "~/shared/lib/ulid";

import {
  contactFieldNames,
  contactSubmissionSchema,
  minimumFillTimeMs,
  readFormValues,
  type ContactFieldErrors,
  type ContactResult,
} from "./contact-schema";
import type { ContactStore } from "./contact-store.server";
import { sendContactEmail } from "./send-contact-email.server";
import { verifyTurnstile } from "./verify-turnstile.server";

export interface ContactDependencies {
  store: ContactStore;
  emailBinding: SendEmail;
  rateLimiter: RateLimit;
  turnstileSecret: string;
  contactInbox: string;
  ipHashSalt: string;
  fetcher?: typeof fetch;
  now?: () => number;
  logError?: (message: string, detail: unknown) => void;
}

interface HandleContactOptions {
  formData: FormData;
  clientIp: string;
  userAgent: string;
  dependencies: ContactDependencies;
}

/**
 * The contact flow (PRD §9.4): validate → honeypot and timing → Turnstile → rate limit →
 * store in D1 → send the notification. A failed email never loses the message: it is
 * already in D1, so the visitor still sees success.
 */
export async function handleContactSubmission({
  formData,
  clientIp,
  userAgent,
  dependencies,
}: HandleContactOptions): Promise<ContactResult> {
  const now = dependencies.now ?? Date.now;
  const logError = dependencies.logError ?? console.error;
  const values = readFormValues(formData);
  const turnstileToken = formData.get("cf-turnstile-response");
  const parsed = contactSubmissionSchema.safeParse({
    ...Object.fromEntries(formData),
    turnstileToken: typeof turnstileToken === "string" ? turnstileToken : undefined,
  });

  if (!parsed.success) {
    const fieldErrors: ContactFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (field === "website") return { status: "rejected", reason: "spam", values };
      if (typeof field === "string" && (contactFieldNames as readonly string[]).includes(field)) {
        fieldErrors[field as keyof ContactFieldErrors] ??= issue.message;
      }
    }
    if (Object.keys(fieldErrors).length === 0) {
      return { status: "rejected", reason: "spam", values };
    }
    return { status: "invalid", fieldErrors, values };
  }

  const submission = parsed.data;
  if (now() - submission.startedAt < minimumFillTimeMs) {
    return { status: "rejected", reason: "spam", values };
  }

  const isHuman = await verifyTurnstile({
    token: submission.turnstileToken,
    secret: dependencies.turnstileSecret,
    remoteIp: clientIp,
    fetcher: dependencies.fetcher,
  });
  if (!isHuman) return { status: "rejected", reason: "turnstile", values };

  const { success: isWithinLimit } = await dependencies.rateLimiter.limit({
    key: `contact:${clientIp}`,
  });
  if (!isWithinLimit) return { status: "rejected", reason: "rate-limited", values };

  const messageId = createUlid(now());
  await dependencies.store.insert({
    id: messageId,
    name: submission.name,
    email: submission.email,
    company: submission.company ?? null,
    message: submission.message,
    ipHash: await hashIp(clientIp, dependencies.ipHashSalt),
    userAgent: userAgent.slice(0, 512),
    status: "received",
    createdAt: new Date(now()).toISOString(),
  });

  const sendOutcome = await sendContactEmail({
    emailBinding: dependencies.emailBinding,
    inbox: dependencies.contactInbox,
    submission,
  });
  if (sendOutcome.isSent) {
    await dependencies.store.markSent(messageId);
  } else {
    logError("Contact email failed", { messageId, errorCode: sendOutcome.errorCode });
    await dependencies.store.markFailed(messageId, sendOutcome.errorCode);
  }
  return { status: "success" };
}
