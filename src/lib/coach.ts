import "server-only";
import { db } from "./db";
import type { CoachExchange } from "./coach-content";
export function getCoachHistory(
  userId: string,
  lessonId: string,
): CoachExchange[] {
  return db()
    .prepare(
      "SELECT id,question,reply,source,follow_up,supported,created_at FROM (SELECT * FROM coach_messages WHERE user_id=? AND lesson_id=? ORDER BY id DESC LIMIT 30) ORDER BY id",
    )
    .all(userId, lessonId).map(row => ({ ...row })) as unknown as CoachExchange[];
}
