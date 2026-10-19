import { summarize } from "./assessment";
import { lessons } from "./lessons";
import type { Attempt, Learner, Subject } from "./types";

// Structural input keeps this deterministic policy independent of the database.
type Position = {
  lesson_id: string;
  updated_at: number;
  review_due: number | null;
};
export type RouteStatus = "review" | "foundation" | "continue" | "start" | "ahead" | "waiting" | "complete";
export function goalSubjects(goal: string): Subject[] {
  if (goal === "CBSE + JEE") return ["Mathematics", "Physics", "Chemistry"];
  if (goal === "CBSE + NEET") return ["Biology", "Physics", "Chemistry"];
  // CUET, BITSAT and state exams can have programme-specific subject choices.
  // Do not infer a stream from the examination name alone.
  return ["Mathematics", "Physics", "Chemistry", "Biology"];
}
export function learningJourney(
  profile: Pick<Learner, "grade" | "goal" | "interests">,
  attempts: Attempt[],
  positions: Position[],
  now: number,
) {
  const preferred = goalSubjects(profile.goal);
  const priority: Record<RouteStatus, number> = {
    review: 0, foundation: 1, continue: 2, start: 3, ahead: 4, waiting: 5, complete: 6,
  };
  return lessons.map((lesson) => {
    const records = attempts.filter((a) => a.lesson_id === lesson.id);
    const position = positions.find((p) => p.lesson_id === lesson.id);
    const summary = summarize(records, lesson.questions);
    const diagnostic = lesson.questions.find((q) => q.kind === "diagnostic")!;
    const diagnosticAttempts = records.filter((a) => a.question_id === diagnostic.id);
    const unresolved = diagnosticAttempts.some((a) => !a.correct) &&
      !diagnosticAttempts.some((a) => a.correct);
    const reviewed = records.some((a) => a.correct &&
      lesson.questions.some((q) => q.id === a.question_id && q.kind === "delayed"));
    let status: RouteStatus;
    let reason: string;
    let action: string;
    let step: 0 | 5 | null = null;
    if (summary.complete && !reviewed && position?.review_due && position.review_due <= now) {
      status = "review"; action = "Open delayed review"; step = 5;
      reason = "Your scheduled recall check is due. Try it before looking back at the explanation.";
    } else if (unresolved) {
      status = "foundation"; action = "Revisit the foundation"; step = 0;
      reason = "Your prerequisite check is not yet correct. Revisit its short explanation, then retry. One check does not assess every prerequisite.";
    } else if (!summary.complete && (records.length > 0 || position)) {
      status = "continue"; action = "Continue this lesson";
      reason = "You have started this sequence. Continue from your saved position and finish the remaining checks.";
    } else if (summary.complete) {
      status = reviewed ? "complete" : "waiting";
      action = "View lesson evidence"; step = 5;
      reason = reviewed
        ? "Your learning sequence and delayed check are recorded. This is evidence from these questions, not chapter mastery."
        : "Your learning sequence is complete. Return when the delayed check opens; repeating known answers adds no new evidence.";
    } else if (lesson.grade > profile.grade) {
      status = "ahead"; action = "Preview this later concept";
      reason = `This draft lesson is placed in grade ${lesson.grade}, beyond your selected grade. Check its prerequisites before attempting it.`;
    } else {
      status = "start"; action = "Check foundations"; step = 0;
      reason = preferred.includes(lesson.subject)
        ? `An available starting point at or below your selected grade, in the subject focus for ${profile.goal}. Begin with its prerequisite check.`
        : "An optional subject exploration. Your selected goal prioritizes other subjects for new lessons.";
    }
    const context = lesson.contexts.find((c) => profile.interests.includes(c.interest));
    return { lesson, status, reason, action, step, context, reviewDue: position?.review_due ?? null,
      updatedAt: Math.max(position?.updated_at ?? 0, ...records.map((a) => a.created_at)),
      preferred: preferred.includes(lesson.subject), priority: priority[status] };
  }).sort((a, b) => a.priority - b.priority ||
    (a.status === "review" ? (a.reviewDue ?? 0) - (b.reviewDue ?? 0) : 0) ||
    (["foundation", "continue"].includes(a.status) ? b.updatedAt - a.updatedAt : 0) ||
    Number(b.preferred) - Number(a.preferred) ||
    a.lesson.grade - b.lesson.grade ||
    Number(!!b.context) - Number(!!a.context) ||
    a.lesson.id.localeCompare(b.lesson.id));
}
