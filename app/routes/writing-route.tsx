import { useSearchParams } from "react-router";

import { getArticleTopics, getPrimaryTopicLabel } from "~/content/article-topics";
import { getAllArticles, getFeaturedArticles } from "~/content/articles";
import { writingTopics } from "~/content/featured-writing";
import type { Article, WritingTopic } from "~/content/schemas";
import { site } from "~/content/site";
import { SiteFooter } from "~/features/contact/site-footer";
import { DockNav } from "~/features/navigation/dock-nav";
import { ArticleCard } from "~/features/writing/article-card";
import { TopicFilter } from "~/features/writing/topic-filter";
import { topicLabels } from "~/features/writing/topic-labels";
import { buildMeta } from "~/shared/seo/build-meta";
import { MonoLabel } from "~/shared/ui/mono-label";

import type { Route } from "./+types/writing-route";

export function meta(_args: Route.MetaArgs) {
  return buildMeta({
    title: `Writing — ${site.name}`,
    description:
      "Technical articles by Lucky Victory on AI agents, payments and fintech, databases, security and the web, published on DEV.",
    path: "/writing",
    ogImage: "writing",
  });
}

export function loader() {
  const featured = getFeaturedArticles();
  const featuredUrls = new Set(featured.map((article) => article.url));
  const toListItem = (article: Article) => ({ ...article, topics: getArticleTopics(article) });
  return {
    featured: featured.map(toListItem),
    others: getAllArticles()
      .filter((article) => !featuredUrls.has(article.url))
      .map(toListItem),
  };
}

/** Narrows `?topic=` to a known topic. A plain lookup keeps Zod out of the client bundle. */
function parseTopic(value: string | null): WritingTopic | null {
  return writingTopics.find((topic) => topic.id === value)?.id ?? null;
}

/** All writing (PRD §6.11): featured first, then the DEV feed by date, filterable by topic. */
export default function WritingRoute({ loaderData }: Route.ComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTopic = parseTopic(searchParams.get("topic"));
  const matchesTopic = (article: { topics: WritingTopic[] }) =>
    activeTopic === null || article.topics.includes(activeTopic);
  const featured = loaderData.featured.filter(matchesTopic);
  const others = loaderData.others.filter(matchesTopic);

  const selectTopic = (topic: WritingTopic | null) => {
    setSearchParams(topic ? { topic } : {}, { preventScrollReset: true, replace: true });
  };

  return (
    <>
      <main id="main" className="paper min-h-svh bg-paper text-paper-text">
        <div className="layout-container pt-8 pb-24">
          <a
            href="/"
            className="type-label inline-flex items-center gap-2 text-paper-muted hover:text-paper-text"
          >
            <span aria-hidden="true">←</span> {site.wordmark}
          </a>
          <p className="type-label mt-16 text-accent-deep">
            Writing · {loaderData.featured.length + loaderData.others.length} articles
          </p>
          <h1 className="type-display-xl mt-6">I write what I build</h1>
          <p className="type-body-lg mt-6 max-w-[40rem] text-paper-muted">
            Guides and deep dives on AI agents, payments, databases and security. Published on DEV,
            on my own profile and on Afriex's organisation.
          </p>
          <div className="mt-12">
            <TopicFilter activeTopic={activeTopic} onSelect={selectTopic} />
          </div>
          <p className="sr-only" aria-live="polite">
            Showing {featured.length + others.length} articles
            {activeTopic ? ` about ${topicLabels[activeTopic]}` : ""}.
          </p>
          {featured.length > 0 ? (
            <section aria-labelledby="featured-heading" className="mt-14">
              <MonoLabel as="h2" className="text-paper-muted">
                <span id="featured-heading">Featured</span>
              </MonoLabel>
              <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {featured.map((article, articleIndex) => (
                  <ArticleCard
                    key={article.url}
                    article={article}
                    index={articleIndex}
                    topicLabel={getPrimaryTopicLabel(article, topicLabels)}
                  />
                ))}
              </ul>
            </section>
          ) : null}
          <section aria-labelledby="all-heading" className="mt-16">
            <MonoLabel as="h2" className="text-paper-muted">
              <span id="all-heading">All articles</span>
            </MonoLabel>
            {others.length === 0 ? (
              <p className="mt-6 text-paper-muted">No other articles in this topic yet.</p>
            ) : (
              <ol className="mt-6 border-t border-paper-text/15">
                {others.map((article) => (
                  <li key={article.url} className="border-b border-paper-text/15">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group grid gap-2 py-5 md:grid-cols-[8rem_minmax(0,1fr)_auto] md:items-baseline md:gap-6"
                    >
                      <time dateTime={article.publishedAt} className="type-label text-paper-muted">
                        {article.publishedAt.slice(0, 10)}
                      </time>
                      <span className="text-[1.125rem] font-semibold group-hover:underline">
                        {article.title}
                      </span>
                      <span className="type-label text-paper-muted">
                        {article.publication === "Afriex" ? "DEV · Afriex" : "DEV · codewithveek"} ·{" "}
                        {article.readingTimeMinutes} min
                      </span>
                      <span className="sr-only"> (opens DEV in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      </main>
      <div className="bg-bg">
        <SiteFooter />
      </div>
      <DockNav />
    </>
  );
}
