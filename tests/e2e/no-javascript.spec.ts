import { expect, test } from "@playwright/test";

test.use({ javaScriptEnabled: false });

test.describe("without JavaScript (PRD §2.3, §12.3)", () => {
  test("every home section's heading and text is in the server HTML", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: /lucky\s*victory/i })).toBeVisible();
    await expect(
      page.getByText(/Backend & full-stack engineer building payment systems/),
    ).toBeVisible();
    for (const word of ["Moves money", "Watches agents", "Ships to customers", "Explains itself"]) {
      await expect(page.getByText(word, { exact: true }).first()).toBeVisible();
    }
    await expect(page.getByText("Articles published")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Things I've built" })).toBeVisible();
    for (const title of [
      "Zia",
      "Afriex developer ecosystem",
      "DriftWatch",
      "Cutroom",
      "Nippyy backend",
    ]) {
      await expect(page.getByRole("heading", { level: 3, name: title })).toBeVisible();
    }
    await expect(page.getByText(/I like the unglamorous parts/)).toBeVisible();
    await expect(page.getByText(/Per Borgen/)).toBeVisible();
    await expect(page.getByRole("heading", { name: "I write what I build" })).toBeVisible();
    await expect(page.getByText(/LET'S BUILD|Let's build/i).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /hello@veek\.me/ })).toBeVisible();
  });

  test("production HTML never contains [Lucky] placeholders (PRD §10.5)", async ({ page }) => {
    for (const path of [
      "/",
      "/work/zia",
      "/work/afriex-ecosystem",
      "/work/nippyy-backend",
      "/writing",
    ]) {
      const response = await page.goto(path);
      expect(await response?.text()).not.toContain("[Lucky]");
    }
  });

  test("/writing filters with ?topic= links", async ({ page }) => {
    await page.goto("/writing");
    await page.getByRole("link", { name: "Databases" }).click();
    await expect(page).toHaveURL(/topic=databases/);
    await expect(
      page.getByText("From RAG to Agents: How TiDB Powers Modern AI Applications"),
    ).toBeVisible();
    await expect(page.getByText("Afriex Webhook Integration Guide", { exact: false })).toHaveCount(
      0,
    );
  });
});
