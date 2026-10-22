import type { AnchorHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router";

type ButtonVariant = "primary" | "outline";

interface ButtonLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  variant?: ButtonVariant;
  children: ReactNode;
  hasArrow?: boolean;
  /** Use client-side routing for internal routes. Anchors (#…) and files stay plain links. */
  isRouterLink?: boolean;
}

export function ButtonLink({
  href,
  variant = "primary",
  children,
  hasArrow = false,
  isRouterLink = false,
  className = "",
  ...anchorProps
}: ButtonLinkProps) {
  const classes = `button button-${variant} ${className}`;
  const content = (
    <>
      <span>{children}</span>
      {hasArrow ? (
        <span className="button-arrow" aria-hidden="true">
          →
        </span>
      ) : null}
    </>
  );
  if (isRouterLink) {
    return (
      <Link to={href} className={classes} {...anchorProps}>
        {content}
      </Link>
    );
  }
  return (
    <a href={href} className={classes} {...anchorProps}>
      {content}
    </a>
  );
}
