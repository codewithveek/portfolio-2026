import { index, route, type RouteConfig } from "@react-router/dev/routes";

/** Explicit route config (PRD §5, §9.6). */
export default [
  index("routes/home-route.tsx"),
  route("work/:slug", "routes/work-detail-route.tsx"),
  route("writing", "routes/writing-route.tsx"),
  route("api/contact", "routes/contact-action-route.ts"),
  route("api/events", "routes/events-action-route.ts"),
  route("sitemap.xml", "routes/sitemap-route.ts"),
  route("robots.txt", "routes/robots-route.ts"),
  route("*", "routes/not-found-route.tsx"),
] satisfies RouteConfig;
