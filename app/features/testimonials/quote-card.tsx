import type { Testimonial } from "~/content/schemas";
import { FadeUp } from "~/shared/motion/fade-up";

function toInitials(name: string): string {
  return name
    .replace(/^(Dr|Mr|Mrs|Ms|Prof)\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

/** Quote card with a monogram avatar (PRD §6.7). The featured card is lime with black text. */
export function QuoteCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  const isFeatured = testimonial.isFeatured;
  return (
    <FadeUp
      as="figure"
      index={index}
      className={`flex h-full flex-col justify-between gap-10 rounded-card p-8 md:p-10 ${
        isFeatured ? "bg-accent text-accent-ink" : "border border-border bg-surface text-text"
      }`}
    >
      <blockquote className="type-body-lg md:text-[1.25rem]">
        <p>“{testimonial.quote}”</p>
      </blockquote>
      <figcaption className="flex items-center gap-4">
        <span
          aria-hidden="true"
          className={`type-label flex size-12 shrink-0 items-center justify-center rounded-full ${
            isFeatured ? "bg-accent-ink text-accent" : "bg-surface-raised text-accent-text"
          }`}
        >
          {toInitials(testimonial.name)}
        </span>
        <span className="flex flex-col">
          <span className="font-semibold">{testimonial.name}</span>
          <span className={isFeatured ? "text-accent-ink/80" : "text-text-muted"}>
            {testimonial.title}
          </span>
        </span>
      </figcaption>
    </FadeUp>
  );
}
