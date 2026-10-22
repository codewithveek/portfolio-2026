import { hackathonWins, maintainedPackages, scrimbaRole } from "~/content/proof";
import { shouldShowPlaceholders } from "~/shared/lib/placeholder";

import { HackathonList } from "./hackathon-list";
import { StatBlock } from "./stat-block";

/** Four sourced stats under a hairline (PRD §6.4, §10.5). */
interface ProofStripProps {
  /** Technical articles in the DEV snapshot, counted by the loader. */
  articleCount: number;
  /** When the DEV snapshot was fetched (YYYY-MM-DD). */
  articlesFetchedOn: string;
}

export function ProofStrip({ articleCount, articlesFetchedOn }: ProofStripProps) {
  const fetchedOn = articlesFetchedOn;
  const hasHackathonWins = hackathonWins.length > 0;

  return (
    <section aria-label="Proof" className="layout-container pb-[clamp(4rem,8vw,7rem)]">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
        <StatBlock
          index={0}
          label="Articles published"
          value={articleCount}
          source={`DEV API, technical posts only, fetched ${fetchedOn}`}
        />
        <StatBlock
          index={1}
          label="npm packages maintained"
          value={maintainedPackages.length}
          source={`content/proof.ts: ${maintainedPackages.join(", ")}`}
        />
        {hasHackathonWins ? (
          <StatBlock
            index={2}
            label="Hackathon wins"
            value={hackathonWins.length}
            source="content/proof.ts"
          >
            <HackathonList wins={hackathonWins} />
          </StatBlock>
        ) : shouldShowPlaceholders ? (
          <StatBlock index={2} label="Hackathon wins" value="[Lucky]" source="PRD §14 item 3" />
        ) : null}
        <StatBlock
          index={3}
          label={scrimbaRole.label}
          value={scrimbaRole.value}
          source={scrimbaRole.source}
        >
          <p className="type-label text-text-muted">{scrimbaRole.detail}</p>
        </StatBlock>
      </dl>
    </section>
  );
}
