import { test, expect } from "@playwright/test";

test("learning route uses profile and diagnostics, records foundation help and isolates learners", async ({ page, browser }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/pilot");
  await page.getByRole("button", { name: "Start a local trial" }).click();
  await expect(page).toHaveURL("/curriculum");
  await page.goto("/settings");
  await page.getByLabel("Learning goal").selectOption("CBSE + NEET");
  await page.getByRole("button", { name: "Save my learning profile" }).click();
  await expect(page.getByRole("status")).toContainText("saved");
  await page.goto("/journey");
  const first = page.locator(".journey-card").first();
  await expect(first).toHaveAttribute("data-route-lesson", "inheritance");
  await first.getByRole("button", { name: "Check foundations" }).click();
  await expect(page).toHaveURL("/learn/inheritance");
  const diagnostic = page.locator('[data-question-id="gene-d"]');
  await diagnostic.locator("input").fill("0");
  await diagnostic.getByRole("button", { name: "Check answer" }).click();
  await expect(page.getByRole("complementary", { name: "Foundation explanation" })).toContainText("equally likely");
  // Leave at another stage: the recommendation must restore the diagnostic step.
  await page.getByRole("button", { name: "Discover the connection" }).click();
  await page.goto("/journey");
  await expect(first).toHaveAttribute("data-route-status", "foundation");
  await first.getByRole("button", { name: "Revisit the foundation" }).click();
  await expect(page).toHaveURL("/learn/inheritance");
  await expect(diagnostic.locator("input")).toBeVisible();
  await diagnostic.getByRole("button", { name: /Revisit the foundation/ }).click();
  await expect(page.getByRole("heading", { name: "Count equally likely outcomes" })).toBeVisible();
  await diagnostic.locator("input").fill("1/2");
  await diagnostic.getByRole("button", { name: "Check answer" }).click();
  await expect(diagnostic.locator(".answer-status")).toContainText("With support / retry");
  await page.goto("/journey");
  await expect(first).toHaveAttribute("data-route-status", "continue");
  await page.reload();
  await expect(first).toHaveAttribute("data-route-status", "continue");
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

  // Reading foundation help before the first attempt must still record assistance.
  await page.goto("/learn/proportions");
  const ratio = page.locator('[data-question-id="ratio-d"]');
  await ratio.getByRole("button", { name: /Revisit the foundation/ }).click();
  await expect(page.getByRole("heading", { name: "Find the amount for one unit" })).toBeVisible();
  await ratio.locator("input").fill("75");
  await ratio.getByRole("button", { name: "Check answer" }).click();
  await expect(ratio.locator(".answer-status")).toContainText("With support / retry");

  const otherContext = await browser.newContext();
  const other = await otherContext.newPage();
  await other.goto("/journey");
  await expect(other).toHaveURL(/\/login/);
  await other.goto("/pilot");
  await other.getByRole("button", { name: "Start a local trial" }).click();
  await expect(other).toHaveURL("/curriculum");
  await other.goto("/journey");
  await expect(other.locator('[data-route-status="foundation"], [data-route-status="continue"]')).toHaveCount(0);
  await otherContext.close();
  expect(errors).toEqual([]);
});
