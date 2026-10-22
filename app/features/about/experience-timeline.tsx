import { experience } from "~/content/experience";
import { containsPlaceholder, withoutPlaceholders } from "~/shared/lib/placeholder";

/** Role · organisation · years, newest first, max five rows (PRD §6.6). */
export function ExperienceTimeline() {
  const rows = withoutPlaceholders(experience).slice(0, 5);
  if (rows.length === 0) return null;
  return (
    <div className="mt-12">
      <h3 className="type-label text-text-muted">Experience</h3>
      <ol className="mt-4 border-t border-border">
        {rows.map((row) => (
          <li
            key={`${row.organisation}-${row.role}`}
            className={`grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 border-b border-border py-4 ${
              containsPlaceholder(row) ? "outline-1 outline-dashed outline-accent/60" : ""
            }`}
          >
            <span className="text-text">{row.role}</span>
            <span className="type-label row-span-2 self-center text-text-muted">{row.years}</span>
            <span className="text-text-muted">{row.organisation}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
