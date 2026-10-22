import { data } from "react-router";

import { NotFoundPage } from "~/features/not-found/not-found-page";
import { site } from "~/content/site";

import type { Route } from "./+types/not-found-route";

export function loader() {
  return data(null, { status: 404 });
}

export function meta(_args: Route.MetaArgs) {
  return [{ title: `Not found — ${site.name}` }, { name: "robots", content: "noindex" }];
}

export default function NotFoundRoute() {
  return <NotFoundPage />;
}
