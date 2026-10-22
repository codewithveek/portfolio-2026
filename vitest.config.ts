import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [mdx({ remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter] })],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    include: ["app/**/*.test.{ts,tsx}", "scripts/**/*.test.ts"],
    environment: "node",
  },
});
