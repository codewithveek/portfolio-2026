import type { Config } from "@react-router/dev/config";

export default {
  // Every page is server-rendered (PRD §9.2). Prerendering is not used; see docs/decisions/0001-rendering.md.
  ssr: true,
} satisfies Config;
