import type { MetaDescriptor } from "react-router";

import { site } from "~/content/site";

interface BuildMetaOptions {
  title: string;
  description: string;
  path: string;
  /** OG image name in /og (PRD §9.8), without extension. */
  ogImage?: string;
}

/** Title, description, canonical, Open Graph and Twitter tags (PRD §9.8). */
export function buildMeta({
  title,
  description,
  path,
  ogImage = "home",
}: BuildMetaOptions): MetaDescriptor[] {
  const url = `${site.origin}${path === "/" ? "" : path}`;
  const imageUrl = `${site.origin}/og/${ogImage}.png`;
  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url || site.origin },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "veek.me" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url || site.origin },
    { property: "og:image", content: imageUrl },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: "@CodewithVeek" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: imageUrl },
  ];
}
