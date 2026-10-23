import { useEffect, useRef, type FormEvent } from "react";
import { useFetcher } from "react-router";

import { site } from "~/content/site";
import { trackEvent } from "~/features/analytics/track-event";

import type { ContactResult } from "./contact-schema";
import { FormField } from "./form-field";
import { useTurnstile } from "./use-turnstile";

interface ContactFormProps {
  turnstileSiteKey: string;
  /** Result of a no-JS submission, rendered on the server (PRD §9.4 step 6). */
  serverResult: ContactResult | null;
  isSentViaRedirect: boolean;
  /** Server render time, used as `startedAt` when JavaScript is off. */
  renderedAt: number;
}

const rejectionMessages = {
  spam: "That didn't look like a person typing. Please try again in a few seconds.",
  turnstile: `We couldn't verify the anti-spam check. It needs JavaScript; you can also email ${site.email}.`,
  "rate-limited": "Too many messages from this connection. Please wait a minute and try again.",
  unavailable: `The form isn't accepting messages right now. Please email ${site.email} instead.`,
} as const;

/**
 * Contact form (PRD §6.9, §9.4). With JS it posts to /api/contact through a fetcher and shows
 * an inline success state. Without JS it posts to the home route's action, which renders
 * field errors with the values kept, or redirects to /?sent=1#contact.
 */
export function ContactForm({
  turnstileSiteKey,
  serverResult,
  isSentViaRedirect,
  renderedAt,
}: ContactFormProps) {
  const fetcher = useFetcher<ContactResult>();
  const turnstileRef = useRef<HTMLDivElement>(null);
  const { hasLoadError, resetTurnstile } = useTurnstile(turnstileRef, turnstileSiteKey);
  const startedAtRef = useRef<HTMLInputElement>(null);
  const result = fetcher.data ?? serverResult;
  const isSubmitting = fetcher.state !== "idle";

  const submitWithFetcher = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void fetcher.submit(event.currentTarget, { method: "post", action: "/api/contact" });
  };

  // The server-rendered value is the render time; with JS the clock starts when the form mounts.
  useEffect(() => {
    if (startedAtRef.current) startedAtRef.current.value = String(Date.now());
  }, []);

  useEffect(() => {
    if (!fetcher.data) return;
    trackEvent("contact_submit", fetcher.data.status);
    if (fetcher.data.status !== "success") resetTurnstile();
  }, [fetcher.data, resetTurnstile]);

  if (isSentViaRedirect || result?.status === "success") {
    return (
      <div role="status" className="rounded-card border border-accent-text/40 bg-surface p-8">
        <p className="type-label text-accent-text">Message received</p>
        <p className="type-body-lg mt-3 text-text">
          Thanks — I'll reply from {site.email}, usually within two working days.
        </p>
      </div>
    );
  }

  const fieldErrors = result?.status === "invalid" ? result.fieldErrors : {};
  const values = result?.values ?? {};

  return (
    <form
      method="post"
      action="/?index"
      onSubmit={submitWithFetcher}
      className="flex flex-col gap-6"
      aria-describedby={result?.status === "rejected" ? "contact-form-error" : undefined}
      noValidate
    >
      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          name="name"
          label="Name"
          isRequired
          autoComplete="name"
          minLength={2}
          maxLength={80}
          defaultValue={values.name}
          error={fieldErrors.name}
        />
        <FormField
          name="email"
          label="Email"
          type="email"
          isRequired
          autoComplete="email"
          maxLength={254}
          defaultValue={values.email}
          error={fieldErrors.email}
        />
      </div>
      <FormField
        name="company"
        label="Company"
        autoComplete="organization"
        maxLength={120}
        defaultValue={values.company}
        error={fieldErrors.company}
      />
      <FormField
        name="message"
        label="Message"
        isMultiline
        isRequired
        minLength={20}
        maxLength={4000}
        defaultValue={values.message}
        error={fieldErrors.message}
      />
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input ref={startedAtRef} type="hidden" name="startedAt" defaultValue={renderedAt} />
      <div ref={turnstileRef} className="min-h-[65px]" />
      {result?.status === "rejected" || hasLoadError ? (
        <p id="contact-form-error" role="alert" className="text-sm text-danger">
          {result?.status === "rejected"
            ? rejectionMessages[result.reason]
            : rejectionMessages.turnstile}
        </p>
      ) : null}
      <button
        type="submit"
        className="button button-primary w-full sm:w-fit"
        disabled={isSubmitting}
      >
        <span>{isSubmitting ? "Sending…" : "Send message"}</span>
        <span className="button-arrow" aria-hidden="true">
          →
        </span>
      </button>
    </form>
  );
}
