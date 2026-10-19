"use server";
import { randomUUID, createHash } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  createSession,
  destroySession,
  hashPassword,
  requireLearner,
  verifyPassword,
} from "@/lib/auth";
import { getLesson } from "@/lib/lessons";
import { gradeAnswer, summarize } from "@/lib/assessment";
import { getAttempts, getProgress } from "@/lib/progress";
import { goals, interests } from "@/lib/catalog";

export type FormState = { error?: string; success?: string };
const accountSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(
      /^[a-z0-9_]{3,32}$/,
      "Use 3–32 lowercase letters, numbers, or underscores for your username.",
    ),
  password: z
    .string()
    .min(12, "Use a password with at least 12 characters.")
    .max(128),
});
export async function authenticate(
  _previous: FormState,
  form: FormData,
): Promise<FormState> {
  const parsed = accountSchema.safeParse({
    username: form.get("username"),
    password: form.get("password"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { username, password } = parsed.data;
  const key = createHash("sha256").update(username).digest("hex");
  const limit = db()
    .prepare("SELECT * FROM login_limits WHERE key=?")
    .get(key) as { failures: number; reset_at: number } | undefined;
  if (limit && limit.reset_at > Date.now() && limit.failures >= 8)
    return { error: "Too many attempts. Try again in 15 minutes." };
  let user = db()
    .prepare("SELECT id, password_hash FROM users WHERE username=?")
    .get(username) as { id: string; password_hash: string } | undefined;
  if (form.get("mode") === "register") {
    const name = z.string().trim().min(1).max(60).safeParse(form.get("name"));
    if (!name.success)
      return { error: "Enter a display name of up to 60 characters." };
    if (form.get("acknowledgement") !== "on")
      return {
        error: "Confirm that you understand this is a development workspace.",
      };
    if (user)
      return {
        error: "That username is unavailable. Choose another or sign in.",
      };
    const id = randomUUID();
    db()
      .prepare(
        "INSERT INTO users(id,username,name,password_hash,created_at) VALUES (?,?,?,?,?)",
      )
      .run(id, username, name.data, hashPassword(password), Date.now());
    user = { id, password_hash: "" };
  } else {
    // Perform the expensive hash even for a missing account to reduce timing differences.
    const dummy = "00000000000000000000000000000000:" + "00".repeat(64);
    const valid = verifyPassword(password, user?.password_hash || dummy);
    if (!user || !valid) {
      const failures =
        limit && limit.reset_at > Date.now() ? limit.failures + 1 : 1;
      db()
        .prepare(
          "INSERT INTO login_limits VALUES(?,?,?) ON CONFLICT(key) DO UPDATE SET failures=excluded.failures,reset_at=excluded.reset_at",
        )
        .run(
          key,
          failures,
          limit && limit.reset_at > Date.now()
            ? limit.reset_at
            : Date.now() + 900000,
        );
      return { error: "The username or password is incorrect." };
    }
  }
  db().prepare("DELETE FROM login_limits WHERE key=?").run(key);
  await createSession(user.id);
  redirect(form.get("mode") === "register" ? "/settings?welcome=1" : "/");
}
export async function logout() {
  await destroySession();
  redirect("/");
}
export async function saveProfile(
  _previous: FormState,
  form: FormData,
): Promise<FormState> {
  const user = await requireLearner();
  const parsed = z
    .object({
      name: z.string().trim().min(1).max(60),
      grade: z.coerce.number().int().min(8).max(12),
      goal: z.string().refine((g) => goals.includes(g)),
      interests: z
        .array(z.string().refine((i) => interests.includes(i)))
        .max(12),
    })
    .safeParse({
      name: form.get("name"),
      grade: form.get("grade"),
      goal: form.get("goal"),
      interests: form.getAll("interests"),
    });
  if (!parsed.success)
    return {
      error: "Check your display name, grade, goal, and interest choices.",
    };
  const data = parsed.data;
  db()
    .prepare("UPDATE users SET name=?,grade=?,goal=?,interests=? WHERE id=?")
    .run(
      data.name,
      data.grade,
      data.goal,
      JSON.stringify(data.interests),
      user.id,
    );
  revalidatePath("/", "layout");
  return { success: "Your learning profile has been saved." };
}
export async function saveLessonPosition(
  lessonId: string,
  stage: number,
  interest: string,
) {
  const user = await requireLearner();
  const lesson = getLesson(lessonId);
  if (
    !lesson ||
    !Number.isInteger(stage) ||
    stage < 0 ||
    stage > 5 ||
    (interest !== "Direct" &&
      !lesson.contexts.some((c) => c.interest === interest))
  )
    return { error: "Invalid learning position." };
  db()
    .prepare(
      `INSERT INTO progress(user_id,lesson_id,stage,interest,updated_at) VALUES(?,?,?,?,?) ON CONFLICT(user_id,lesson_id) DO UPDATE SET stage=excluded.stage,interest=excluded.interest,updated_at=excluded.updated_at`,
    )
    .run(user.id, lessonId, stage, interest, Date.now());
  revalidatePath("/");
  revalidatePath("/journey");
  return { success: true };
}
export async function revealHint(lessonId: string, questionId: string) {
  const user = await requireLearner();
  const question = getLesson(lessonId)?.questions.find(
    (q) => q.id === questionId,
  );
  if (!question) return { error: "Question not found." };
  db()
    .prepare("INSERT OR IGNORE INTO hints VALUES(?,?,?)")
    .run(user.id, lessonId, questionId);
  return { hint: question.hint };
}
export type AnswerResult = {
  error?: string;
  correct?: boolean;
  explanation?: string;
  assisted?: boolean;
  firstAttempt?: boolean;
  reviewDue?: number | null;
};
export async function submitAnswer(
  lessonId: string,
  questionId: string,
  answer: string,
): Promise<AnswerResult> {
  const user = await requireLearner();
  const lesson = getLesson(lessonId);
  const question = lesson?.questions.find((q) => q.id === questionId);
  if (!lesson || !question || typeof answer !== "string" || answer.length > 100)
    return { error: "Invalid question or answer." };
  if (question.kind === "delayed") {
    const progress = getProgress(user.id).find((p) => p.lesson_id === lessonId);
    if (!progress?.review_due || progress.review_due > Date.now())
      return {
        error: "Your delayed review is not due yet. Return on the date shown.",
      };
  }
  const result = gradeAnswer(question, answer);
  if (!result.valid)
    return {
      error:
        "Enter a finite number, decimal, or fraction such as 3/2. Leave the unit out of the answer.",
    };
  const database = db();
  database.exec("BEGIN IMMEDIATE");
  try {
    const previous = getAttempts(user.id, lessonId).filter(
      (a) => a.question_id === questionId,
    );
    if (previous.some((a) => a.correct)) {
      database.exec("ROLLBACK");
      return {
        error:
          "This question already has a successful recorded answer. Repeated attempts do not add new evidence.",
      };
    }
    const hinted = !!database
      .prepare(
        "SELECT 1 FROM hints WHERE user_id=? AND lesson_id=? AND question_id=?",
      )
      .get(user.id, lessonId, questionId);
    const assisted =
      hinted || question.kind === "guided" || previous.length > 0;
    database
      .prepare(
        "INSERT INTO attempts(user_id,lesson_id,question_id,answer,correct,assisted,created_at,content_version) VALUES(?,?,?,?,?,?,?,?)",
      )
      .run(
        user.id,
        lessonId,
        questionId,
        answer.trim(),
        Number(result.correct),
        Number(assisted),
        Date.now(),
        lesson.version,
      );
    const summary = summarize(getAttempts(user.id, lessonId), lesson.questions);
    if (summary.complete) {
      database
        .prepare(
          `INSERT INTO progress(user_id,lesson_id,stage,interest,updated_at,review_due) VALUES(?,?,5,'Direct',?,?) ON CONFLICT(user_id,lesson_id) DO UPDATE SET updated_at=excluded.updated_at,review_due=COALESCE(progress.review_due,excluded.review_due)`,
        )
        .run(user.id, lessonId, Date.now(), Date.now() + 86400000);
    }
    if (question.kind === "delayed" && result.correct)
      database
        .prepare(
          "UPDATE progress SET review_due=NULL WHERE user_id=? AND lesson_id=?",
        )
        .run(user.id, lessonId);
    const reviewDue = getProgress(user.id).find(
      (p) => p.lesson_id === lessonId,
    )?.review_due;
    database.exec("COMMIT");
    revalidatePath("/");
    revalidatePath("/progress");
    revalidatePath("/journey");
    return {
      correct: result.correct,
      explanation: result.correct ? question.explanation : question.hint,
      assisted,
      firstAttempt: previous.length === 0,
      reviewDue,
    };
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
}
