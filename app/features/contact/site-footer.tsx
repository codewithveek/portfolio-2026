import { socialLinks } from "~/content/site";
import { site } from "~/content/site";
import { withoutPlaceholders } from "~/shared/lib/placeholder";

/** Footer row (PRD §6.9). */
export function SiteFooter() {
  const links = withoutPlaceholders(socialLinks);
  return (
    <footer className="layout-container flex flex-col gap-6 border-t border-border py-10 pb-28 md:flex-row md:items-center md:justify-between">
      <p className="type-label text-text-muted">© 2026 {site.legalName}</p>
      <ul className="flex flex-wrap gap-x-6 gap-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              rel="me noreferrer"
              target="_blank"
              className="type-label text-text hover:text-accent-text"
            >
              {link.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="type-label text-text-muted">Built with React Router on Cloudflare Workers</p>
    </footer>
  );
}
