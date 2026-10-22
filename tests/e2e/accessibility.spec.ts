import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const path of ["/", "/work/zia", "/writing"]) {
  test(`no serious or critical axe violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    // Scroll to the end so triggered reveals settle. Scroll-linked states such as
    // word-highlight's muted words (PRD §8.4) are transient and finish once scrolled past.
    await page.evaluate(async () => {
      for (let offset = 0; offset < document.body.scrollHeight; offset += 600) {
        window.scrollTo(0, offset);
        await new Promise((resolve) => setTimeout(resolve, 30));
      }
    });
    await page.waitForTimeout(800);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
      .analyze();
    const blocking = results.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact ?? ""),
    );
    expect(
      blocking.map(
        (violation) =>
          `${violation.id}: ${violation.nodes.map((node) => node.target.join(" ")).join(", ")}`,
      ),
    ).toEqual([]);
  });
}
