import type { MetaDescriptor } from "react-router";

import { site, socialLinks } from "~/content/site";
import { withoutPlaceholders } from "~/shared/lib/placeholder";

/** JSON-LD `Person` (PRD §9.8), rendered through React Router's `script:ld+json` meta. */
export function personJsonLd(): MetaDescriptor {
  return {
    "script:ld+json": {
      "@context": "https://schema.org",
      "@type": "Person",
      name: site.legalName,
      alternateName: site.alternateNames,
      jobTitle: site.jobTitle,
      url: site.origin,
      email: `mailto:${site.email}`,
      address: { "@type": "PostalAddress", addressLocality: "Lagos", addressCountry: "NG" },
      sameAs: withoutPlaceholders(socialLinks, false).map((link) => link.href),
    },
  };
}
