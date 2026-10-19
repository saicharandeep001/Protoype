import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { LessonWorkspace } from "@/components/lesson-workspace";
import { getLesson } from "@/lib/lessons";
import { currentLearner } from "@/lib/auth";
import { getAttempts, getProgress } from "@/lib/progress";
import { getCoachHistory } from "@/lib/coach";
import { coachEntries } from "@/lib/coach-content";
export default async function Learn({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lesson = getLesson(id);
  if (!lesson) notFound();
  const user = await currentLearner();
  const progress = user
    ? getProgress(user.id).find((p) => p.lesson_id === id)
    : undefined;
  const attempts = user ? getAttempts(user.id, id) : [];
  const initialAnswers = attempts
    .filter((a) => a.correct)
    .map((a) => ({ id: a.question_id, assisted: !!a.assisted }));
  const publicLesson = {
    ...lesson,
    questions: lesson.questions.map(({ id, kind, prompt, unit }) => ({
      id,
      kind,
      prompt,
      unit,
    })),
  };
  return (
    <Shell section="Learning studio">
      <LessonWorkspace
        lesson={publicLesson}
        authenticated={!!user}
        initialStage={progress?.stage || 0}
        initialInterest={
          progress?.interest ||
          lesson.contexts.find((c) => user?.interests.includes(c.interest))
            ?.interest ||
          lesson.contexts[0].interest
        }
        initialAnswers={initialAnswers}
        initialReviewDue={progress?.review_due || null}
        coachHistory={user ? getCoachHistory(user.id, id) : []}
        coachPrompts={coachEntries
          .filter((entry) => entry.lesson === id)
          .map((entry) => entry.prompts[0])}
      />
    </Shell>
  );
}
