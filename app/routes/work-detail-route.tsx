import { useEffect } from "react";
import { data } from "react-router";

import { ProjectBody } from "~/content/project-body";
import { getNextProject, getProjectBySlug } from "~/content/projects.server";
import { site } from "~/content/site";
import { trackEvent } from "~/features/analytics/track-event";
import { ArchitectureDiagram } from "~/features/case-study/architecture-diagram";
import { CaseStudyCta } from "~/features/case-study/case-study-cta";
import { CaseStudyHeader } from "~/features/case-study/case-study-header";
import { CaseStudyMedia } from "~/features/case-study/case-study-media";
import { CaseStudySection } from "~/features/case-study/case-study-section";
import { DecisionList } from "~/features/case-study/decision-list";
import { getDisplayedDownloads } from "~/features/case-study/package-downloads";
import { ResultsList } from "~/features/case-study/results-list";
import { NextProjectCard } from "~/features/case-study/next-project-card";
import { SiteFooter } from "~/features/contact/site-footer";
import { DockNav } from "~/features/navigation/dock-nav";
import { ScrollProgressLine } from "~/features/navigation/scroll-progress-line";
import { withoutPlaceholders } from "~/shared/lib/placeholder";
import { buildMeta } from "~/shared/seo/build-meta";

import type { Route } from "./+types/work-detail-route";

export function loader({ params }: Route.LoaderArgs) {
  const project = getProjectBySlug(params.slug);
  if (!project) throw data(null, { status: 404 });
  const nextProject = getNextProject(project.slug);
  return {
    project,
    nextProject: nextProject
      ? { slug: nextProject.slug, title: nextProject.title, tagline: nextProject.tagline }
      : null,
    packageDownloads: getDisplayedDownloads(project.links.npm),
  };
}

export function meta({ loaderData }: Route.MetaArgs) {
  if (!loaderData) return [{ title: `Not found — ${site.name}` }];
  const { project } = loaderData;
  return buildMeta({
    title: `${project.title} — case study by ${site.name}`,
    description: `${project.tagline} ${project.summary}`.slice(0, 300),
    path: `/work/${project.slug}`,
    ogImage: `work-${project.slug}`,
  });
}

export default function WorkDetailRoute({ loaderData }: Route.ComponentProps) {
  const { project, nextProject, packageDownloads } = loaderData;
  const nextSteps = withoutPlaceholders(project.next);

  useEffect(() => {
    trackEvent("case_study_view", project.slug);
  }, [project.slug]);

  return (
    <>
      <ScrollProgressLine />
      <main id="main">
        <CaseStudyHeader project={project} />
        <CaseStudyMedia project={project} />
        <div className="mt-16 lg:mt-24">
          <CaseStudySection id="problem" number="01" title="The problem">
            <div className="case-study-prose">
              {project.problem.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          </CaseStudySection>
          <CaseStudySection id="built" number="02" title="What I built">
            <ArchitectureDiagram spans={project.architecture} />
            <div className="case-study-prose mt-12">
              <ProjectBody slug={project.slug} />
            </div>
          </CaseStudySection>
          <CaseStudySection id="decisions" number="03" title="Decisions and trade-offs">
            <DecisionList decisions={project.decisions} />
          </CaseStudySection>
          <CaseStudySection id="results" number="04" title="Results">
            <ResultsList project={project} packageDownloads={packageDownloads} />
          </CaseStudySection>
          {nextSteps.length > 0 ? (
            <CaseStudySection id="next" number="05" title="What I would do next">
              <ul className="case-study-prose flex flex-col gap-3">
                {nextSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </CaseStudySection>
          ) : null}
        </div>
        <div className="layout-container flex flex-col gap-6 pt-8 pb-24">
          <CaseStudyCta />
          {nextProject ? <NextProjectCard project={nextProject} /> : null}
        </div>
      </main>
      <SiteFooter />
      <DockNav />
    </>
  );
}
