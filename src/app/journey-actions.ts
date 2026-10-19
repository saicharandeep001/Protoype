"use server";
import { redirect } from "next/navigation";
import { requireLearner } from "@/lib/auth";
import { getLesson } from "@/lib/lessons";
import { getProgress } from "@/lib/progress";
import { saveLessonPosition } from "./actions";

export async function openLearningStep(lessonId: string, step: 0 | 5 | null) {
  const user = await requireLearner();
  const lesson = getLesson(lessonId);
  if (!lesson || (step !== null && step !== 0 && step !== 5)) return;
  if (step !== null) {
    const position = getProgress(user.id).find((p) => p.lesson_id === lessonId);
    const interest = position?.interest || lesson.contexts.find((c) => user.interests.includes(c.interest))?.interest || "Direct";
    await saveLessonPosition(lessonId, step, interest);
  }
  redirect(`/learn/${lessonId}`);
}
