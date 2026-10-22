import { defineConfig, devices } from "@playwright/test";

const port = 4173;
// Cloud sessions can point at a preinstalled Chromium build.
const executablePath = process.env.PLAYWRIGHT_CHROMIUM || undefined;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${port}`,
    trace: "retain-on-failure",
    launchOptions: { executablePath },
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    { name: "mobile", use: { ...devices["Pixel 7"], viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    // Production build, served by the Workers runtime (vite preview + Cloudflare plugin).
    command: `pnpm db:migrate:local && pnpm build && pnpm exec vite preview --port ${port} --strictPort`,
    port,
    timeout: 240_000,
    reuseExistingServer: !process.env.CI,
  },
});
