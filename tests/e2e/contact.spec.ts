import { expect, test } from "@playwright/test";

/**
 * Contact submission (PRD §11 M4). Turnstile's widget script is replaced with a stub that adds
 * a token; the Worker verifies it with Turnstile's always-pass test secret.
 */
test("contact form validates, then submits", async ({ page }) => {
  await page.route("https://challenges.cloudflare.com/turnstile/v0/api.js*", (route) =>
    route.fulfill({
      contentType: "text/javascript",
      body: `window.turnstile = { render(container) { const input = document.createElement("input"); input.type = "hidden"; input.name = "cf-turnstile-response"; input.value = "XXXX.DUMMY.TOKEN.XXXX"; container.appendChild(input); return "widget"; }, reset() {}, remove() {} };`,
    }),
  );
  await page.goto("/#contact");
  const form = page.locator("#contact form");
  await form.getByLabel("Name").fill("A");
  await form.getByRole("button", { name: "Send message" }).click();
  await expect(form.getByText("Please enter your name.")).toBeVisible();

  await form.getByLabel("Name").fill("Playwright Tester");
  await form.getByLabel("Email").fill("tester@example.com");
  await form
    .getByLabel("Message")
    .fill("This is an automated end-to-end test of the contact form.");
  await page.waitForTimeout(3_100); // the form must be at least 3 s old (PRD §9.4)
  await form.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByText("Message received")).toBeVisible({ timeout: 15_000 });
});
