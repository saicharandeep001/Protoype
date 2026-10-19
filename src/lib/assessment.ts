import type { Attempt, Question } from "./types";

// Deliberately accepts numbers and a single fraction, not expressions or code.
export function parseAnswer(raw: string): number | null {
  const value = raw.trim();
  const numeric = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i;
  if (numeric.test(value)) {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  const parts = value.split("/").map((x) => x.trim());
  if (parts.length !== 2 || !parts.every((x) => numeric.test(x))) return null;
  const [a, b] = parts.map(Number);
  const result = a / b;
  return b !== 0 && Number.isFinite(result) ? result : null;
}
export function gradeAnswer(question: Question, raw: string) {
  const value = parseAnswer(raw);
  if (value === null) return { valid: false, correct: false };
  return {
    valid: true,
    correct: Math.abs(value - question.answer) <= question.tolerance,
  };
}
export function summarize(attempts: Attempt[], questions: Question[]) {
  const first = new Map<string, Attempt>();
  for (const a of [...attempts].sort((a, b) => a.id - b.id))
    if (!first.has(a.question_id)) first.set(a.question_id, a);
  const independent = questions.filter(
    (q) => q.kind === "independent" || q.kind === "transfer",
  );
  const firstPass = independent.filter((q) => {
    const a = first.get(q.id);
    return a?.correct === 1 && a.assisted === 0;
  }).length;
  const successful = new Set(
    attempts.filter((a) => a.correct).map((a) => a.question_id),
  );
  const complete = questions
    .filter((q) => q.kind !== "delayed")
    .every((q) => successful.has(q.id));
  const retained = questions
    .filter((q) => q.kind === "delayed")
    .some(
      (q) => first.get(q.id)?.correct === 1 && first.get(q.id)?.assisted === 0,
    );
  return {
    firstPass,
    independentTotal: independent.length,
    complete,
    retained,
    attempted: first.size,
    successful: successful.size,
  };
}
