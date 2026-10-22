import { env } from "cloudflare:workers";
import { redirect } from "react-router";

import { devArticles, getFeaturedArticles } from "~/content/articles";
import { getProjects } from "~/content/projects.server";
import { site } from "~/content/site";
import { AboutSection } from "~/features/about/about-section";
import { ContactSection } from "~/features/contact/contact-section";
import { SiteFooter } from "~/features/contact/site-footer";
import { processContactRequest } from "~/features/contact/contact-request.server";
import { HeroSection } from "~/features/hero/hero-section";
import { DockNav } from "~/features/navigation/dock-nav";
import { ScrollProgressLine } from "~/features/navigation/scroll-progress-line";
import { PositioningSection } from "~/features/positioning/positioning-section";
import { ProofStrip } from "~/features/proof/proof-strip";
import { TestimonialsSection } from "~/features/testimonials/testimonials-section";
import { toProjectSummary } from "~/features/work/project-summary";
import { WorkSection } from "~/features/work/work-section";
import { WritingSection } from "~/features/writing/writing-section";
import { buildMeta } from "~/shared/seo/build-meta";
import { personJsonLd } from "~/shared/seo/person-json-ld";

import type { Route } from "./+types/home-route";

export function meta(_args: Route.MetaArgs) {
  return [
    ...buildMeta({ title: site.title, description: site.description, path: "/" }),
    personJsonLd(),
  ];
}

export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  return {
    projects: getProjects().map(toProjectSummary),
    featuredArticles: getFeaturedArticles(),
    articleCount: devArticles.articles.length,
    articlesFetchedOn: devArticles.fetchedAt.slice(0, 10),
    turnstileSiteKey: env.TURNSTILE_SITE_KEY,
    isSentViaRedirect: url.searchParams.get("sent") === "1",
    renderedAt: Date.now(),
  };
}

/** No-JS contact submissions land here so errors render with the entered values (PRD §9.4). */
export async function action({ request }: Route.ActionArgs) {
  const result = await processContactRequest(request);
  if (result.status === "success") return redirect("/?sent=1#contact");
  return result;
}

export default function HomeRoute({ loaderData, actionData }: Route.ComponentProps) {
  return (
    <>
      <ScrollProgressLine />
      <main id="main">
        <HeroSection />
        <PositioningSection />
        <ProofStrip
          articleCount={loaderData.articleCount}
          articlesFetchedOn={loaderData.articlesFetchedOn}
        />
        <WorkSection projects={loaderData.projects} />
        <AboutSection />
        <TestimonialsSection />
        <WritingSection articles={loaderData.featuredArticles} />
        <ContactSection
          turnstileSiteKey={loaderData.turnstileSiteKey}
          serverResult={actionData ?? null}
          isSentViaRedirect={loaderData.isSentViaRedirect}
          renderedAt={loaderData.renderedAt}
        />
      </main>
      <SiteFooter />
      <DockNav hasHero />
    </>
  );
}
