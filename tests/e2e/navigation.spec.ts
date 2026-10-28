import { expect, test } from "@playwright/test";

test("dock appears after the hero and jumps to sections", async ({ page }) => {
  await page.goto("/");
  const dock = page.getByRole("navigation", { name: "Sections" });
  await page.locator("#positioning").scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 1200);
  await expect(dock.getByRole("link", { name: "Hire me" })).toBeVisible();
  await dock.getByRole("link", { name: "Writing" }).click();
  await expect(page.locator("#writing")).toBeInViewport();
  await expect(page).toHaveURL(/#writing$/);
});

test("project card opens its case study", async ({ page }) => {
  await page.goto("/");
  // Centre the DriftWatch card so it is the active one (on desktop the sticky index panel shows
  // the active card's link), then wait for smooth scrolling to settle before clicking.
  await page
    .locator('[data-project-card="2"]')
    .evaluate((card) => card.scrollIntoView({ block: "center" }));
  const caseStudyLink = page.getByRole("link", { name: /Read case study: DriftWatch/ });
  await expect(caseStudyLink).toBeVisible();
  await page.waitForFunction(
    () =>
      new Promise((resolve) => {
        const startY = window.scrollY;
        setTimeout(() => resolve(window.scrollY === startY), 300);
      }),
  );
  await caseStudyLink.click();
  await expect(page).toHaveURL(/\/work\/driftwatch$/);
  await expect(page.getByRole("heading", { level: 1, name: "DriftWatch" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Decisions and trade-offs/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Next project/ })).toBeVisible();
});

test("/writing filters in place with JavaScript", async ({ page }) => {
  await page.goto("/writing");
  await page.getByRole("link", { name: "Security" }).click();
  await expect(page).toHaveURL(/topic=security/);
  await expect(
    page.getByText("Understanding TOCTOU: The Race Condition Hiding in Your Code"),
  ).toBeVisible();
  await expect(page.getByText("AI Memory Systems: Everything You Need to Know")).toHaveCount(0);
});

test("unknown pages return the styled 404", async ({ page }) => {
  const response = await page.goto("/does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Read my writing" })).toBeVisible();
  expect((await page.goto("/work/unknown-project"))?.status()).toBe(404);
});
