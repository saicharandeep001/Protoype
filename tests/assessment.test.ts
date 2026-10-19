import { test } from "node:test";
import assert from "node:assert/strict";
import { gradeAnswer, parseAnswer, summarize } from "../src/lib/assessment";
import { lessons } from "../src/lib/lessons";
import type { Attempt } from "../src/lib/types";

test("numeric input handles decimals, signs, exponent notation and fractions", () => {
  assert.equal(parseAnswer(" 3/2 "), 1.5);
  assert.equal(parseAnswer("-1.25"), -1.25);
  assert.equal(parseAnswer("6.02e3"), 6020);
  assert.equal(parseAnswer(".75"), 0.75);
});
test("invalid input cannot silently become zero or an infinite answer", () => {
  for (const raw of [
    "",
    " ",
    "1/0",
    "1/2/3",
    "NaN",
    "Infinity",
    "1e999",
    "1+2",
    "75g",
    "1,2",
    "0x10",
  ])
    assert.equal(parseAnswer(raw), null, raw);
});
test("grading uses question-specific absolute tolerance", () => {
  const q = lessons.find((l) => l.id === "proportions")!.questions[0];
  assert.equal(gradeAnswer(q, "75").correct, true);
  assert.equal(gradeAnswer(q, "75.5").correct, false);
  assert.equal(gradeAnswer(q, "").valid, false);
});
const lesson = lessons.find((l) => l.id === "proportions")!;
const attempt = (
  id: number,
  question_id: string,
  correct: number,
  assisted = 0,
): Attempt => ({
  id,
  question_id,
  lesson_id: lesson.id,
  correct,
  assisted,
  created_at: id,
  answer: "1",
});
test("a successful retry never becomes an unaided first-pass success", () => {
  const result = summarize(
    [attempt(1, "ratio-i1", 0), attempt(2, "ratio-i1", 1, 1)],
    lesson.questions,
  );
  assert.equal(result.firstPass, 0);
  assert.equal(result.successful, 1);
});
test("hints and guided answers are excluded from independent first-pass evidence", () => {
  const result = summarize(
    [
      attempt(1, "ratio-i1", 1, 1),
      attempt(2, "ratio-g", 1, 1),
      attempt(3, "ratio-t", 1),
    ],
    lesson.questions,
  );
  assert.equal(result.firstPass, 1);
  assert.equal(result.independentTotal, 3);
});
test("completion requires every learning check and is separate from retention", () => {
  const answers = lesson.questions
    .filter((q) => q.kind !== "delayed")
    .map((q, i) => attempt(i + 1, q.id, 1));
  assert.equal(summarize(answers.slice(1), lesson.questions).complete, false);
  assert.equal(summarize(answers, lesson.questions).complete, true);
  assert.equal(summarize(answers, lesson.questions).retained, false);
  assert.equal(
    summarize([...answers, attempt(9, "ratio-r", 1)], lesson.questions)
      .retained,
    true,
  );
});
test("each lesson has unique question IDs and genuinely distinct prompts", () => {
  const ids = new Set<string>();
  for (const l of lessons) {
    assert.equal(
      new Set(l.questions.map((q) => q.prompt)).size,
      l.questions.length,
    );
    for (const q of l.questions) {
      assert.equal(ids.has(q.id), false, q.id);
      ids.add(q.id);
      assert.ok(Number.isFinite(q.answer));
      assert.ok(q.tolerance > 0);
      assert.ok(q.hint && q.explanation);
    }
    for (const kind of [
      "diagnostic",
      "guided",
      "independent",
      "transfer",
      "delayed",
    ])
      assert.ok(l.questions.some((q) => q.kind === kind));
  }
});
test("representative answer keys agree with independent domain calculations", () => {
  const all = lessons.flatMap((l) => l.questions);
  const answer = (id: string) => all.find((q) => q.id === id)!.answer;
  assert.equal(answer("ratio-t"), 180 / (84 / 7));
  assert.equal(answer("projectile-t"), 8 * Math.sqrt((2 * 20) / 10));
  assert.equal(answer("mole-t"), Math.min(2 / 1, 3 / 3) * 2);
  assert.equal(answer("gene-t"), 0.5 * 1);
});
