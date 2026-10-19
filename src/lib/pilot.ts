import "server-only";
import { db } from "./db";
import { getStats } from "./progress";
import type { Learner } from "./types";

export function localDemoEnabled() {
  return (
    process.env.LOCAL_DEMO_ENABLED === "1" ||
    (process.env.NODE_ENV !== "production" &&
      process.env.LOCAL_DEMO_ENABLED !== "0")
  );
}
export type PilotFeedback = {
  id: number;
  clarity: number;
  relevance: number;
  note: string;
  created_at: number;
};
export function getFeedback(userId: string) {
  return db()
    .prepare(
      "SELECT id,clarity,relevance,note,created_at FROM pilot_feedback WHERE user_id=? ORDER BY id DESC",
    )
    .all(userId) as unknown as PilotFeedback[];
}
export function getEvaluation(user: Learner) {
  const stats = getStats(user.id);
  const coaching = db()
    .prepare(
      "SELECT lesson_id,question,reply,source,follow_up,supported,created_at FROM coach_messages WHERE user_id=? ORDER BY id",
    )
    .all(user.id);
  return {
    product: "PeduC",
    report_version: 1,
    exported_at: new Date().toISOString(),
    pilot_target: "January–February 2027",
    scope:
      "Local usability evaluation of four draft lessons; not a learning-efficacy study or full curriculum certification.",
    learner: {
      display_name: user.name,
      grade: user.grade,
      goal: user.goal,
      interests: user.interests,
      local_demo: !!user.is_demo,
    },
    summary: {
      completed_sequences: stats.completed,
      available_sequences: stats.evidence.length,
      unaided_first_pass_answers: stats.firstPass,
      recorded_attempts: stats.attempts.length,
      coaching_exchanges: coaching.length,
      delayed_reviews_due: stats.due,
    },
    lessons: stats.evidence.map((e) => ({
      id: e.lesson.id,
      title: e.lesson.title,
      content_version: e.lesson.version,
      complete: e.complete,
      unaided_first_pass: e.firstPass,
      independent_questions: e.independentTotal,
      unaided_delayed_recall: e.retained,
    })),
    attempts: stats.attempts.map(
      ({
        id,
        lesson_id,
        question_id,
        answer,
        correct,
        assisted,
        created_at,
      }) => ({
        id,
        lesson_id,
        question_id,
        answer,
        correct: !!correct,
        assisted: !!assisted,
        created_at: new Date(created_at).toISOString(),
      }),
    ),
    coaching,
    feedback: getFeedback(user.id),
    interpretation:
      "A retry is not a first pass. Coach assistance during a check is recorded as support. Question counts and feedback ratings do not establish learning gains. An educator-reviewed comparison and delayed unseen assessments are needed to evaluate efficacy.",
  };
}
