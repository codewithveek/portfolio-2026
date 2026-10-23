import { expect, test } from "@playwright/test";

const lightBackground = "rgb(245, 244, 240)";
const darkBackground = "rgb(8, 8, 10)";

function readBodyBackground(): string {
  return getComputedStyle(document.body).backgroundColor;
}

test.describe("theme", () => {
  test("is dark by default even when the system prefers light", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveAttribute("data-theme");
    expect(await page.evaluate(readBodyBackground)).toBe(darkBackground);
  });

  test("the toggle turns light on, survives a reload, and turns it off", async ({ page }) => {
    const cspViolations: string[] = [];
    page.on("console", (message) => {
      if (/Content Security Policy/i.test(message.text())) cspViolations.push(message.text());
    });
    await page.goto("/");
    const html = page.locator("html");
    const toggle = page.locator("#home").getByRole("button", { name: "Light theme" });

    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await toggle.click();
    await expect(html).toHaveAttribute("data-theme", "light");
    await expect(toggle).toHaveAttribute("aria-pressed", "true");

    // The pre-paint script applies the stored choice before hydration.
    await page.reload();
    await expect(html).toHaveAttribute("data-theme", "light");
    expect(await page.evaluate(readBodyBackground)).toBe(lightBackground);

    await toggle.click();
    await expect(html).not.toHaveAttribute("data-theme");
    expect(await page.evaluate(readBodyBackground)).toBe(darkBackground);
    expect(cspViolations).toEqual([]);
  });
});
