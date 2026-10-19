import { test, expect, type Page } from "@playwright/test";
import { DatabaseSync } from "node:sqlite";

const password = "Test-only-password-42";
async function register(page: Page, username: string) {
  await page.goto("/login");
  await page
    .getByLabel("Display name", { exact: true })
    .fill("Learning Tester");
  await page.getByLabel("Username", { exact: true }).fill(username);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Create my workspace" }).click();
  await expect(page).toHaveURL(/\/settings\?welcome=1/);
}
async function answer(page: Page, questionId: string, value: string) {
  const card = page.locator(`[data-question-id="${questionId}"]`);
  await card.locator("input").fill(value);
  await card.getByRole("button", { name: "Check answer" }).click();
  await expect(card.getByRole("status")).toContainText("Correct.");
}

test("guest workspace, curriculum filters and mobile layout", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "A familiar world. A new understanding.",
    }),
  ).toBeVisible();
  await expect(page.locator(".lesson-card")).toHaveCount(4);
  await page.screenshot({
    path: "test-results/workspace-desktop.png",
    fullPage: true,
  });
  await page.goto("/curriculum");
  await page.getByLabel("Filter by subject").selectOption("Biology");
  await page.getByLabel("Available lessons").check();
  await expect(page.locator(".topic-row")).toHaveCount(1);
  await page.getByRole("link", { name: "Open lesson" }).click();
  await page.getByRole("button", { name: "Discover the connection" }).click();
  await page.getByLabel("Parent cross").selectOption("1");
  await expect(
    page.getByRole("img", { name: /Punnett square/ }),
  ).toHaveAttribute("aria-label", /Recessive probability 2\/4/);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: "test-results/lesson-mobile.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.goto("/");
  await page.screenshot({
    path: "test-results/workspace-mobile.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});

test("account, profile, durable learning evidence, delayed review and account isolation", async ({
  page,
  browser,
}) => {
  const username = `learner_${Date.now()}`;
  await register(page, username);
  await page.getByLabel("Your grade").selectOption("12");
  await page.getByLabel("Learning goal").selectOption("CBSE + NEET");
  await page.getByLabel("Nature", { exact: true }).check();
  await page.getByRole("button", { name: "Save my learning profile" }).click();
  await expect(page.getByRole("status")).toContainText("saved");
  await page.reload();
  await expect(page.getByLabel("Your grade")).toHaveValue("12");
  await expect(page.getByLabel("Learning goal")).toHaveValue("CBSE + NEET");
  await page.goto("/learn/proportions");
  const diagnostic = page.locator(".question-card");
  await page.locator("#ratio-d").fill("0");
  await diagnostic.getByRole("button", { name: "Check answer" }).click();
  await expect(diagnostic.getByRole("status")).toContainText("Not yet");
  await page.locator("#ratio-d").fill("1/0");
  await diagnostic.getByRole("button", { name: "Check answer" }).click();
  await expect(diagnostic.getByRole("alert")).toContainText("finite number");
  await answer(page, "ratio-d", "75");
  await expect(diagnostic.locator(".answer-status")).toContainText(
    "With support / retry",
  );
  await page.getByRole("button", { name: "Discover the connection" }).click();
  await page.getByRole("button", { name: "Design", exact: true }).click();
  await expect(page.getByRole("slider", { name: "Width" })).toBeVisible();
  await page.getByRole("button", { name: "Build the formal model" }).click();
  await expect(page.locator(".katex")).toBeVisible();
  await page.getByRole("button", { name: "Practise independently" }).click();
  await answer(page, "ratio-g", "450");
  await answer(page, "ratio-i1", "10");
  await answer(page, "ratio-i2", "9");
  await page.getByRole("button", { name: "Transfer the idea" }).click();
  await answer(page, "ratio-t", "15");
  await page.getByRole("button", { name: "Review & revisit" }).click();
  await expect(
    page.getByRole("heading", { name: "Build understanding that lasts." }),
  ).toBeVisible();
  await expect(
    page.getByText("Return for delayed recall", { exact: true }),
  ).toBeVisible();
  await expect(page.locator("#ratio-r")).toHaveCount(0);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Build understanding that lasts." }),
  ).toBeVisible();
  await page.goto("/progress");
  const evidence = page.locator(".evidence-detail").filter({
    has: page.getByRole("heading", {
      name: "Ratios & proportional reasoning",
    }),
  });
  await expect(evidence.locator(".evidence-number")).toHaveText("3 / 3");
  await expect(evidence).toContainText("Completed");
  await page.getByRole("button", { name: "Sign out" }).click();
  await page.goto("/login");
  await page
    .getByRole("button", { name: "Sign in", exact: true })
    .first()
    .click();
  await page.getByLabel("Username", { exact: true }).fill(username);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page
    .locator("form")
    .getByRole("button", { name: "Sign in", exact: true })
    .click();
  await expect(page).toHaveURL("/");
  const cookies = await page.context().cookies();
  expect(cookies.find((c) => c.name === "cbc_session")?.httpOnly).toBe(true);

  // Advance only this test learner's due date; verifies the delayed gate without waiting a day.
  const database = new DatabaseSync(process.env.DATABASE_PATH!);
  const user = database
    .prepare("SELECT id FROM users WHERE username=?")
    .get(username) as { id: string };
  database
    .prepare(
      "UPDATE progress SET review_due=? WHERE user_id=? AND lesson_id='proportions'",
    )
    .run(Date.now() - 1000, user.id);
  const count = database
    .prepare(
      "SELECT COUNT(*) AS n FROM attempts WHERE user_id=? AND question_id='ratio-d'",
    )
    .get(user.id) as { n: number };
  expect(count.n).toBe(2); // invalid fraction did not create evidence
  await page.goto("/journey");
  await expect(page.locator(".journey-card").first()).toHaveAttribute("data-route-status", "review");
  await page.getByRole("button", { name: "Open delayed review" }).click();
  await expect(page).toHaveURL("/learn/proportions");
  await answer(page, "ratio-r", "51");
  await expect(
    page.getByText("Your delayed review answer has been recorded.", {
      exact: false,
    }),
  ).toBeVisible();
  await page.goto("/progress");
  await expect(
    page.getByText("Unaided answer recorded", { exact: true }),
  ).toBeVisible();
  database.close();

  const otherContext = await browser.newContext();
  const other = await otherContext.newPage();
  await register(other, `other_${Date.now()}`);
  await other.goto("/progress");
  await expect(
    other.getByText("No answers recorded yet.", { exact: false }),
  ).toBeVisible();
  await other.goto("/learn/proportions");
  await other.getByRole("button", { name: "Practise independently" }).click();
  const question = other.locator('[data-question-id="ratio-i1"]');
  await question.getByRole("button", { name: /Show a hint/ }).click();
  await expect(question.getByRole("status")).toContainText("scale factor");
  await answer(other, "ratio-i1", "10");
  await expect(question.locator(".answer-status")).toContainText(
    "With support / retry",
  );
  await other.goto("/progress");
  await expect(
    other
      .locator(".evidence-detail")
      .filter({
        has: other.getByRole("heading", {
          name: "Ratios & proportional reasoning",
        }),
      })
      .locator(".evidence-number"),
  ).toHaveText("0 / 3");
  await otherContext.close();
});
