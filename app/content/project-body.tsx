import type { ComponentType } from "react";

/** MDX bodies ("What I built" walkthroughs). Shared by server and client so hydration matches. */
const bodyModules = import.meta.glob<ComponentType>("./projects/*.mdx", {
  eager: true,
  import: "default",
});

/** Renders a project's MDX walkthrough, or nothing if the file has no body. */
export function ProjectBody({ slug }: { slug: string }) {
  const MdxBody = bodyModules[`./projects/${slug}.mdx`];
  return MdxBody ? <MdxBody /> : null;
}
