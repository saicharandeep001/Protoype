import { test, expect } from "@playwright/test";

test("local trial, persistent coaching, evidence integrity, feedback and private export", async ({
  page,
  browser,
}) => {
  await page.goto("/pilot");
  await expect(
    page.getByRole("heading", { name: "Try the idea. See the evidence." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Start a local trial" }).click();
  await expect(page).toHaveURL("/curriculum");
  await page.goto("/learn/proportions");
  await page.getByRole("button", { name: "Build the formal model" }).click();
  const coach = page.getByRole("complementary", { name: "PeduC text coach" });
  await coach
    .getByRole("button", { name: "What stays constant in a proportion?" })
    .click();
  await expect(coach.locator(".coach-reply")).toContainText(
    "The invariant is y/x",
  );
  await page.reload();
  await expect(coach.locator(".coach-question")).toContainText(
    "What stays constant",
  );
  await page.getByRole("button", { name: "Practise independently" }).click();
  await coach
    .getByLabel("Ask the lesson coach")
    .fill("How do I find a scale factor?");
  await coach.getByRole("button", { name: "Send question" }).click();
  await expect(coach.locator(".coach-reply").last()).toContainText(
    "length scale factor",
  );
  const check = page.locator('[data-question-id="ratio-i1"]');
  await check.locator("input").fill("10");
  await check.getByRole("button", { name: "Check answer" }).click();
  await expect(check.locator(".answer-status")).toContainText(
    "With support / retry",
  );
  await coach
    .getByLabel("Ask the lesson coach")
    .fill("What will the stock market do tomorrow?");
  await coach.getByRole("button", { name: "Send question" }).click();
  await expect(coach.locator(".coach-reply").last()).toContainText(
    "don’t have an authored explanation",
  );
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole("button", { name: "Build the formal model" }).click();
  await page.screenshot({
    path: "test-results/peduc-coach-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("link", { name: "Open text coach" }).click();
  await page.screenshot({ path: "test-results/peduc-coach-mobile.png" });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.goto("/pilot");
  await page.getByLabel("How clear was the explanation?").selectOption("4");
  await page.getByLabel("Did the interest connection help?").selectOption("5");
  await page
    .getByLabel("What worked, and what needs improvement?")
    .fill(
      "The scale-factor explanation helped. I want more unseen questions to test the idea.",
    );
  await page.getByRole("button", { name: "Save evaluation feedback" }).click();
  await expect(page.getByRole("status")).toContainText("Feedback saved");
  const response = await page.request.get("/api/evaluation/export");
  expect(response.ok()).toBe(true);
  expect(response.headers()["cache-control"]).toContain("no-store");
  const report = await response.json();
  expect(report.product).toBe("PeduC");
  expect(report.learner.local_demo).toBe(true);
  expect(report.summary.unaided_first_pass_answers).toBe(0);
  expect(report.summary.coaching_exchanges).toBe(3);
  expect(report.attempts).toHaveLength(1);
  expect(report.feedback).toHaveLength(1);
  expect(report.coaching[2].supported).toBe(0);
  expect(JSON.stringify(report)).not.toContain("password_hash");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({
    path: "test-results/peduc-pilot-desktop.png",
    fullPage: true,
  });
  const otherContext = await browser.newContext();
  const other = await otherContext.newPage();
  expect((await other.request.get("/api/evaluation/export")).status()).toBe(
    401,
  );
  await other.goto("/pilot");
  await other.getByRole("button", { name: "Start a local trial" }).click();
  await expect(other).toHaveURL("/curriculum");
  const otherReport = await (
    await other.request.get("/api/evaluation/export")
  ).json();
  expect(otherReport.coaching).toHaveLength(0);
  expect(otherReport.attempts).toHaveLength(0);
  expect(otherReport.feedback).toHaveLength(0);
  await otherContext.close();
});
