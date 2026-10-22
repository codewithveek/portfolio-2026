declare module "*.mdx" {
  import type { ComponentType } from "react";

  export const frontmatter: unknown;
  const MdxContent: ComponentType;
  export default MdxContent;
}
