import { testimonials } from "~/content/testimonials";
import { SectionKicker } from "~/shared/ui/section-kicker";

import { QuoteCard } from "./quote-card";

/**
 * Testimonials (PRD §6.7). Two cards side by side. The data is a list so more can be added;
 * at three or more the PRD calls for the carousel layout (not needed yet).
 */
export function TestimonialsSection() {
  const orderedTestimonials = [...testimonials].sort(
    (first, second) => Number(second.isFeatured) - Number(first.isFeatured),
  );
  return (
    <section
      aria-labelledby="testimonials-heading"
      className="section-padding layout-container pt-0"
    >
      <SectionKicker number="03" text="Kind words" />
      <h2 id="testimonials-heading" className="sr-only">
        Kind words
      </h2>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {orderedTestimonials.map((testimonial, testimonialIndex) => (
          <QuoteCard key={testimonial.name} testimonial={testimonial} index={testimonialIndex} />
        ))}
      </div>
    </section>
  );
}
