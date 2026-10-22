import type { ComponentType } from "react";

/** MDX bodies ("What I built" walkthroughs). Shared by server and client so hydration matches. */
const bodyModules = import.meta.glob<ComponentType>("./projects/*.mdx", {
  eager: true,
  import: "default",
});

export function getProjectBody(slug: string): ComponentType | undefined {
  return bodyModules[`./projects/${slug}.mdx`];
}
