import { resumeVariants, site } from "~/content/site";
import { trackEvent } from "~/features/analytics/track-event";
import { placeholderSafe } from "~/shared/lib/placeholder";
import { FadeUp } from "~/shared/motion/fade-up";
import { MaskRevealText } from "~/shared/motion/mask-reveal-text";
import { ButtonLink } from "~/shared/ui/button";
import { SectionKicker } from "~/shared/ui/section-kicker";

import { ContactForm } from "./contact-form";
import type { ContactResult } from "./contact-schema";

interface ContactSectionProps {
  turnstileSiteKey: string;
  serverResult: ContactResult | null;
  isSentViaRedirect: boolean;
  renderedAt: number;
}

/** Closing CTA, contact form and résumé links (PRD §6.9). */
export function ContactSection({
  turnstileSiteKey,
  serverResult,
  isSentViaRedirect,
  renderedAt,
}: ContactSectionProps) {
  const bookingUrl = placeholderSafe(site.bookingUrl);
  const isBookingUrlReal = bookingUrl?.startsWith("https://") ?? false;
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="grid-texture section-padding"
    >
      <div className="layout-container">
        <SectionKicker number="05" text="Contact" />
        <span id="contact-heading" className="sr-only">
          Contact: let's build what's next
        </span>
        <MaskRevealText lines={site.closingHeadline} className="type-display-xl mt-8 text-text" />
        <FadeUp className="mt-14 flex flex-col gap-3 md:flex-row">
          <a
            href={`mailto:${site.email}`}
            onClick={() => trackEvent("cta_click", "email")}
            className="button button-primary min-h-16 flex-1 justify-between px-6 text-[0.9375rem]"
          >
            <span>
              Email me <span aria-hidden="true">→</span> {site.email}
            </span>
          </a>
          {isBookingUrlReal ? (
            <ButtonLink
              href={bookingUrl ?? ""}
              variant="outline"
              className="min-h-16 px-6"
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent("cta_click", "book_call")}
            >
              Book a 20-min call
            </ButtonLink>
          ) : bookingUrl ? (
            <span className="button button-outline min-h-16 border-dashed px-6 text-text-muted">
              Book a 20-min call · {bookingUrl}
            </span>
          ) : null}
        </FadeUp>
        <div className="mt-20 grid gap-12 lg:grid-cols-12 lg:gap-8">
          <FadeUp className="lg:col-span-4">
            <h3 className="type-heading-md text-text">Or send a note</h3>
            <p className="mt-4 text-text-muted">
              Roles, contracts or a question about something I wrote. I read every message.
            </p>
            <ul className="mt-8 flex flex-col gap-3">
              {resumeVariants.map((variant) => (
                <li key={variant.id}>
                  <a
                    href={variant.href}
                    onClick={() => trackEvent("resume_download", variant.id)}
                    className="type-label inline-flex items-center gap-2 text-text hover:text-accent"
                  >
                    <span aria-hidden="true" className="text-accent">
                      ↓
                    </span>{" "}
                    {variant.label} (PDF)
                  </a>
                </li>
              ))}
            </ul>
          </FadeUp>
          <FadeUp className="lg:col-span-7 lg:col-start-6">
            <ContactForm
              turnstileSiteKey={turnstileSiteKey}
              serverResult={serverResult}
              isSentViaRedirect={isSentViaRedirect}
              renderedAt={renderedAt}
            />
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
