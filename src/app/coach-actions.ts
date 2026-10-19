"use server";
import { requireLearner } from "@/lib/auth";
import { db } from "@/lib/db";
import { getLesson } from "@/lib/lessons";
import { getAttempts, getProgress } from "@/lib/progress";
import { findCoachEntry, type CoachExchange } from "@/lib/coach-content";
import { revalidatePath } from "next/cache";

export async function askCoach(
  lessonId: string,
  rawQuestion: string,
): Promise<{ error?: string; exchange?: CoachExchange }> {
  const user = await requireLearner();
  const lesson = getLesson(lessonId);
  if (
    !lesson ||
    typeof rawQuestion !== "string" ||
    rawQuestion.trim().length < 3 ||
    rawQuestion.length > 600
  )
    return {
      error: "Ask a question about this lesson using 3–600 characters.",
    };
  const question = rawQuestion.trim();
  const recent = db()
    .prepare(
      "SELECT COUNT(*) AS count FROM coach_messages WHERE user_id=? AND created_at>?",
    )
    .get(user.id, Date.now() - 60000) as { count: number };
  if (recent.count >= 20)
    return {
      error:
        "Take a moment to read the explanations, then try again in a minute.",
    };
  const progress = getProgress(user.id).find((p) => p.lesson_id === lessonId);
  const stage = progress?.stage || 0;
  const attempts = getAttempts(user.id, lessonId);
  const activeKinds =
    stage === 0
      ? ["diagnostic"]
      : stage === 3
        ? ["guided", "independent"]
        : stage === 4
          ? ["transfer"]
          : stage === 5
            ? ["delayed"]
            : [];
  const activeQuestions = lesson.questions.filter(
    (q) =>
      activeKinds.includes(q.kind) &&
      !attempts.some((a) => a.question_id === q.id && a.correct),
  );
  const hintRequested = /\b(hint|stuck|answer|help me solve)\b/i.test(question);
  const entry = findCoachEntry(lessonId, question);
  let reply: string;
  let source: string;
  let followUp: string;
  let supported: boolean;
  if (
    hintRequested &&
    activeQuestions.length &&
    !(
      stage === 5 &&
      (!progress?.review_due || progress.review_due > Date.now())
    )
  ) {
    const current = activeQuestions[0];
    reply = current.hint;
    source = `Lesson ${lesson.id} · v${lesson.version} · ${current.kind} hint`;
    followUp =
      "Write down the relationship you will use, then try the question. This help is recorded with your attempt.";
    supported = true;
  } else if (entry) {
    reply = entry.explanation;
    source = `Lesson ${lesson.id} · v${lesson.version} · ${entry.title}`;
    followUp = entry.followUp;
    supported = true;
  } else {
    reply =
      "I don’t have an authored explanation that confidently matches that question in this lesson yet. Try one of the suggested questions, ask about a specific concept, or use the formal model. I can explain this lesson’s ideas, but I cannot answer arbitrary questions or assess written proofs.";
    source = "Local guide · no confident match";
    followUp =
      "Which part is unclear: the idea, the assumptions, or the next calculation step?";
    supported = false;
  }
  const database = db();
  database.exec("BEGIN IMMEDIATE");
  try {
    if (supported) {
      for (const q of activeQuestions) {
        database
          .prepare(
            "INSERT OR IGNORE INTO hints(user_id,lesson_id,question_id) VALUES(?,?,?)",
          )
          .run(user.id, lessonId, q.id);
      }
    }
    const created = Date.now();
    const result = database
      .prepare(
        "INSERT INTO coach_messages(user_id,lesson_id,question,reply,source,follow_up,supported,created_at) VALUES(?,?,?,?,?,?,?,?)",
      )
      .run(
        user.id,
        lessonId,
        question,
        reply,
        source,
        followUp,
        Number(supported),
        created,
      );
    database.exec("COMMIT");
    revalidatePath("/pilot");
    return {
      exchange: {
        id: Number(result.lastInsertRowid),
        question,
        reply,
        source,
        follow_up: followUp,
        supported: Number(supported),
        created_at: created,
      },
    };
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
}
