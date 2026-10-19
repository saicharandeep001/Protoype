import "server-only";
import { db } from "./db";
import type { Attempt } from "./types";
import { lessons } from "./lessons";
import { summarize } from "./assessment";
export type Progress = {
  lesson_id: string;
  stage: number;
  interest: string;
  updated_at: number;
  review_due: number | null;
};
export function getAttempts(userId: string, lessonId?: string) {
  return (lessonId
    ? db()
        .prepare(
          "SELECT * FROM attempts WHERE user_id=? AND lesson_id=? ORDER BY id",
        )
        .all(userId, lessonId)
    : db()
        .prepare("SELECT * FROM attempts WHERE user_id=? ORDER BY id")
        .all(userId)) as unknown as Attempt[];
}
export function getProgress(userId: string) {
  return db()
    .prepare(
      "SELECT lesson_id, stage, interest, updated_at, review_due FROM progress WHERE user_id=? ORDER BY updated_at DESC",
    )
    .all(userId) as unknown as Progress[];
}
export function getStats(userId?: string) {
  const attempts = userId ? getAttempts(userId) : [];
  const progress = userId ? getProgress(userId) : [];
  const evidence = lessons.map((l) => ({
    lesson: l,
    ...summarize(
      attempts.filter((a) => a.lesson_id === l.id),
      l.questions,
    ),
  }));
  return {
    attempts,
    progress,
    evidence,
    completed: evidence.filter((e) => e.complete).length,
    firstPass: evidence.reduce((sum, e) => sum + e.firstPass, 0),
    due: progress.filter((p) => p.review_due && p.review_due <= Date.now())
      .length,
  };
}
