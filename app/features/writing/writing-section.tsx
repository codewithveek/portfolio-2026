import type { Article } from "~/content/schemas";
import { getPrimaryTopicLabel } from "~/content/articles";
import { ButtonLink } from "~/shared/ui/button";
import { SectionKicker } from "~/shared/ui/section-kicker";

import { ArticleCard } from "./article-card";
import { PaperSection } from "./paper-section";
import { topicLabels } from "./topic-labels";

/** Writing on paper (PRD §6.8): six featured articles, then `All writing →`. */
export function WritingSection({ articles }: { articles: readonly Article[] }) {
  return (
    <PaperSection id="writing" labelledBy="writing-heading">
      <div className="section-padding layout-container">
        <SectionKicker number="04" text="Writing" isOnPaper />
        <h2 id="writing-heading" className="type-display-lg mt-6 text-paper-text">
          I write what I build
        </h2>
        <ul className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, articleIndex) => (
            <ArticleCard
              key={article.url}
              article={article}
              index={articleIndex}
              topicLabel={getPrimaryTopicLabel(article, topicLabels)}
            />
          ))}
        </ul>
        <div className="mt-12">
          <ButtonLink href="/writing" variant="outline" hasArrow isRouterLink>
            All writing
          </ButtonLink>
        </div>
      </div>
    </PaperSection>
  );
}
