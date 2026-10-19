"use server";
import { randomBytes, randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  createSession,
  currentLearner,
  hashPassword,
  requireLearner,
} from "@/lib/auth";
import { db } from "@/lib/db";
import { localDemoEnabled } from "@/lib/pilot";
import type { FormState } from "./actions";

export async function startLocalTrial() {
  if (!localDemoEnabled()) redirect("/login");
  const existing = await currentLearner();
  if (existing) redirect("/curriculum");
  const id = randomUUID();
  db()
    .prepare(
      "INSERT INTO users(id,username,name,password_hash,interests,created_at,is_demo) VALUES(?,?,?,?,?,?,1)",
    )
    .run(
      id,
      `trial_${randomBytes(8).toString("hex")}`,
      "Explorer",
      hashPassword(randomBytes(32).toString("hex")),
      JSON.stringify(["Cricket", "Cooking", "Nature"]),
      Date.now(),
    );
  await createSession(id);
  redirect("/curriculum");
}
export async function savePilotFeedback(
  _previous: FormState,
  form: FormData,
): Promise<FormState> {
  const user = await requireLearner();
  const parsed = z
    .object({
      clarity: z.coerce.number().int().min(1).max(5),
      relevance: z.coerce.number().int().min(1).max(5),
      note: z.string().trim().min(10).max(2000),
    })
    .safeParse({
      clarity: form.get("clarity"),
      relevance: form.get("relevance"),
      note: form.get("note"),
    });
  if (!parsed.success)
    return {
      error:
        "Choose both ratings and write 10–2,000 characters describing what you observed.",
    };
  const recent = db()
    .prepare(
      "SELECT created_at FROM pilot_feedback WHERE user_id=? ORDER BY id DESC LIMIT 1",
    )
    .get(user.id) as { created_at: number } | undefined;
  if (recent && recent.created_at > Date.now() - 30000)
    return {
      error:
        "Your last feedback was saved. Please wait a moment before sending another.",
    };
  db()
    .prepare(
      "INSERT INTO pilot_feedback(user_id,clarity,relevance,note,created_at) VALUES(?,?,?,?,?)",
    )
    .run(
      user.id,
      parsed.data.clarity,
      parsed.data.relevance,
      parsed.data.note,
      Date.now(),
    );
  revalidatePath("/pilot");
  return {
    success:
      "Feedback saved on this device’s application instance. Include it in your evaluation export to share it.",
  };
}
