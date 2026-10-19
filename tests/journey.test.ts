import { test } from "node:test";
import assert from "node:assert/strict";
import { learningJourney, goalSubjects } from "../src/lib/journey";
import { lessons } from "../src/lib/lessons";
import type { Attempt } from "../src/lib/types";

const profile = { grade: 11, goal: "CBSE + JEE", interests: ["Nature"] };
const now = 10_000;
const attempt = (lesson_id: string, question_id: string, correct = 0, id = 1): Attempt =>
  ({ id, lesson_id, question_id, correct, assisted: 0, created_at: id, answer: "0" });
const completed = (id: string) => lessons.find((l) => l.id === id)!.questions
  .filter((q) => q.kind !== "delayed").map((q, i) => attempt(id, q.id, 1, i + 1));

test("subject goals change new lesson order without hiding other subjects", () => {
  const jee = learningJourney(profile, [], [], now);
  const neet = learningJourney({ ...profile, goal: "CBSE + NEET" }, [], [], now);
  assert.equal(jee[0].lesson.subject, "Mathematics");
  assert.equal(jee.at(-1)?.lesson.subject, "Biology");
  assert.equal(neet[0].lesson.subject, "Biology");
  assert.equal(neet.at(-1)?.lesson.subject, "Mathematics");
  assert.equal(neet.length, 4);
  for (const goal of ["CBSE + BITSAT", "CBSE + CUET", "CBSE + TS EAMCET", "CBSE + AP EAMCET", "CBSE + KCET"])
    assert.equal(goalSubjects(goal).length, 4);
});
test("grade eligibility precedes subject preference and context preference", () => {
  const route = learningJourney({ grade: 8, goal: "CBSE + NEET", interests: ["Nature"] }, [], [], now);
  assert.equal(route[0].lesson.id, "proportions");
  assert.equal(route[0].status, "start");
  assert.ok(route.slice(1).every((item) => item.status === "ahead"));
});
test("due recall precedes gaps and interests; future recall stays scheduled", () => {
  const attempts = [...completed("proportions"), attempt("inheritance", "gene-d")];
  const positions = [{ lesson_id: "proportions", review_due: now - 1, updated_at: 1 }];
  let route = learningJourney(profile, attempts, positions, now);
  assert.equal(route[0].status, "review");
  assert.equal(route[0].step, 5);
  assert.equal(route[1].status, "foundation");
  route = learningJourney(profile, attempts, [{ ...positions[0], review_due: now + 1 }], now);
  assert.equal(route[0].status, "foundation");
  assert.equal(route.find((r) => r.lesson.id === "proportions")?.status, "waiting");
});
test("a resolved diagnostic no longer labels the learner as needing foundation repair", () => {
  const attempts = [attempt("inheritance", "gene-d"), attempt("inheritance", "gene-d", 1, 2)];
  const route = learningJourney(profile, attempts, [], now);
  assert.equal(route[0].lesson.id, "inheritance");
  assert.equal(route[0].status, "continue");
  assert.equal(route[0].step, null);
});
test("started lessons resume even beyond selected grade; most recent comes first", () => {
  const positions = [
    { lesson_id: "projectiles", updated_at: 7, review_due: null },
    { lesson_id: "stoichiometry", updated_at: 9, review_due: null },
  ];
  const route = learningJourney({ ...profile, grade: 8 }, [], positions, now);
  assert.equal(route[0].lesson.id, "stoichiometry");
  assert.equal(route[1].lesson.id, "projectiles");
  assert.ok(route.slice(0, 2).every((r) => r.status === "continue"));
});
test("completed delayed checks do not become new review recommendations", () => {
  const attempts = [...completed("proportions"), attempt("proportions", "ratio-r", 1, 9)];
  const route = learningJourney(profile, attempts, [{ lesson_id: "proportions", updated_at: 1, review_due: now - 1 }], now);
  assert.equal(route.at(-1)?.status, "complete");
  assert.equal(route.at(-1)?.lesson.id, "proportions");
});
