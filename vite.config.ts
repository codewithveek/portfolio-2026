import { cloudflare } from "@cloudflare/vite-plugin";
import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { defineConfig } from "vite";

/** Unique per build so the edge cache key changes on every deploy (PRD §9.2). */
const buildId = process.env.BUILD_ID ?? `local-${Date.now().toString(36)}`;

export default defineConfig({
  define: {
    "import.meta.env.VITE_BUILD_ID": JSON.stringify(buildId),
  },
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    {
      enforce: "pre",
      ...mdx({ remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter] }),
    },
    reactRouter(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});
