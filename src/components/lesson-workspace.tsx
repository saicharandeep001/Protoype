"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Circle,
  BookOpen,
  CalendarClock,
  MessageCircle,
} from "lucide-react";
import type { Lesson } from "@/lib/types";
import { saveLessonPosition } from "@/app/actions";
import { QuestionCard, type PublicQuestion } from "./question-card";
import { Simulation } from "./simulation";
import { MathFormula } from "./math";
import { TextCoach } from "./text-coach";
import type { CoachExchange } from "@/lib/coach-content";
type PublicLesson = Omit<Lesson, "questions"> & { questions: PublicQuestion[] };
const stages = [
  "Check foundations",
  "Discover the connection",
  "Build the formal model",
  "Practise independently",
  "Transfer the idea",
  "Review & revisit",
];
const coaching = [
  "Before we start, try the prerequisite question. If it feels unfamiliar, revisit the listed foundations before tackling the lesson.",
  "Predict what will happen before changing the model. Then explain the result in your own words.",
  "Look for the assumptions behind the formula. Which part of the worked example would change if an assumption stopped holding?",
  "Choose your method before calculating. If you need a hint, use it—the record will show where support helped.",
  "The setting is new, but the underlying idea should be familiar. Identify what transfers and what needs a fresh assumption.",
  "A correct answer today is one piece of evidence. Return after a delay to see what you can recall independently.",
];
export function LessonWorkspace({
  lesson,
  initialStage,
  initialInterest,
  initialAnswers,
  initialReviewDue,
  authenticated,
  coachHistory,
  coachPrompts,
}: {
  lesson: PublicLesson;
  initialStage: number;
  initialInterest: string;
  initialAnswers: { id: string; assisted: boolean }[];
  initialReviewDue: number | null;
  authenticated: boolean;
  coachHistory: CoachExchange[];
  coachPrompts: string[];
}) {
  const [stage, setStage] = useState(initialStage);
  const [interest, setInterest] = useState(initialInterest);
  const [answers, setAnswers] = useState(initialAnswers);
  const [reviewDue, setReviewDue] = useState(initialReviewDue);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const context = lesson.contexts.find((c) => c.interest === interest);
  const learningChecks = lesson.questions.filter((q) => q.kind !== "delayed");
  const answeredChecks = learningChecks.filter((q) =>
    answers.some((a) => a.id === q.id),
  ).length;
  const complete = learningChecks.every((q) =>
    answers.some((a) => a.id === q.id),
  );
  const reviewed = lesson.questions
    .filter((q) => q.kind === "delayed")
    .every((q) => answers.some((a) => a.id === q.id));
  function navigate(next: number, nextInterest = interest) {
    if (!authenticated) {
      setStage(next);
      setInterest(nextInterest);
      return;
    }
    startTransition(async () => {
      try {
        const result = await saveLessonPosition(lesson.id, next, nextInterest);
        if (result.error) setError(result.error);
        else {
          setStage(next);
          setInterest(nextInterest);
          setError("");
        }
      } catch {
        setError("Your position could not be saved. Please try again.");
      }
    });
  }
  const onSuccess = (id: string, assisted: boolean, due?: number | null) => {
    setAnswers((current) => [
      ...current.filter((a) => a.id !== id),
      { id, assisted },
    ]);
    if (due !== undefined) setReviewDue(due);
  };
  function questions(kind: PublicQuestion["kind"][]) {
    return authenticated ? (
      lesson.questions
        .filter((q) => kind.includes(q.kind))
        .map((q) => (
          <QuestionCard
            key={q.id}
            question={q}
            lessonId={lesson.id}
            completed={answers.some((a) => a.id === q.id)}
            assisted={answers.find((a) => a.id === q.id)?.assisted || false}
            onSuccess={onSuccess}
          />
        ))
    ) : (
      <div className="panel account-prompt">
        <BookOpen size={26} />
        <h3>Give your progress a place to live.</h3>
        <p>
          Create a test workspace to answer questions, save your learning
          evidence, and schedule a review.
        </p>
        <Link href="/login" className="button">
          Create workspace <ArrowRight size={16} />
        </Link>
      </div>
    );
  }
  return (
    <>
      <Link href="/curriculum" className="back-link">
        <ArrowLeft size={15} /> Back to curriculum
      </Link>
      <div className="page-heading lesson-heading">
        <div>
          <span className="eyebrow">
            {lesson.subject} · GRADE {lesson.grade} · DEVELOPMENT LESSON
          </span>
          <h1>{lesson.title}</h1>
          <p>{lesson.subtitle}</p>
        </div>
        <a href="#text-coach" className="button secondary compact coach-jump">
          <MessageCircle size={15} /> Open text coach
        </a>
      </div>
      <div className="learning-layout with-coach">
        <aside className="learning-route">
          <div className="route-title">YOUR LEARNING ROUTE</div>
          {stages.map((s, i) => (
            <button
              key={s}
              className={`route-step ${i === stage ? "active" : ""}`}
              onClick={() => navigate(i)}
              disabled={pending}
              aria-current={i === stage ? "step" : undefined}
            >
              <span className="step-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{s}</span>
            </button>
          ))}
          <div className="route-objective">
            <span className="mini-label">THE OBJECTIVE</span>
            <p>{lesson.objective}</p>
            <div className="route-progress">
              <span
                style={{
                  width: `${Math.min(100, (answeredChecks / learningChecks.length) * 100)}%`,
                }}
              />
            </div>
            <span className="small muted">
              {answeredChecks} of {learningChecks.length} learning checks
              answered
            </span>
          </div>
        </aside>
        <div className="learning-content">
          <div className="stage-heading">
            <span className="eyebrow">STEP {stage + 1} OF 6</span>
            <span className="save-status">
              {authenticated
                ? pending
                  ? "Saving…"
                  : "Progress saved to your workspace"
                : "Exploring a lesson preview"}
            </span>
          </div>
          {error && (
            <div className="feedback error" role="alert">
              {error}
            </div>
          )}
          <div className="coach-note">
            <MessageCircle size={19} />
            <div>
              <strong>Your lesson guide</strong>
              <p>{coaching[stage]}</p>
            </div>
          </div>
          {stage === 0 && (
            <>
              <h2>Start with solid ground.</h2>
              <p>
                Check the building blocks before moving into a new concept. A
                gap is a useful place to begin.
              </p>
              <div className="prerequisite-list">
                {lesson.prerequisites.map((p) => (
                  <span key={p}>
                    <Circle size={12} />
                    {p}
                  </span>
                ))}
              </div>
              {questions(["diagnostic"])}
            </>
          )}
          {stage === 1 && (
            <>
              <h2>Choose a meaningful starting point.</h2>
              <p>
                These contexts connect directly to this objective. Choose one
                you understand, or explore the formal model directly.
              </p>
              <div className="context-options">
                {[...lesson.contexts.map((c) => c.interest), "Direct"].map(
                  (i) => (
                    <button
                      key={i}
                      disabled={pending}
                      className={
                        interest === i
                          ? "context-option active"
                          : "context-option"
                      }
                      onClick={() => navigate(stage, i)}
                      aria-pressed={interest === i}
                    >
                      {i}
                      {interest === i && <Check size={14} />}
                    </button>
                  ),
                )}
              </div>
              {context ? (
                <div className="context-story">
                  <span className="mini-label">
                    {context.interest.toUpperCase()} →{" "}
                    {lesson.subject.toUpperCase()}
                  </span>
                  <h3>{context.title}</h3>
                  <p>{context.story}</p>
                  <strong>{context.decision}</strong>
                  <div className="context-connection">
                    <span>Why this connection works</span>
                    <p>{context.connection}</p>
                  </div>
                </div>
              ) : (
                <div className="context-story">
                  <h3>Go straight to the relationship.</h3>
                  <p>{lesson.objective}</p>
                  <p>
                    Use the model below to investigate what changes and what
                    stays invariant.
                  </p>
                </div>
              )}
              <Simulation
                key={interest}
                type={lesson.simulation}
                interest={interest}
              />
              <div className="model-boundary">
                <strong>Know the model’s limits</strong>
                <p>
                  {context?.boundary ||
                    "The model uses the simplifying assumptions stated in this lesson. Verify those assumptions before applying it to a new situation."}
                </p>
              </div>
            </>
          )}
          {stage === 2 && (
            <>
              <h2>{lesson.concept.title}</h2>
              <div className="concept-copy">
                {lesson.concept.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <MathFormula value={lesson.concept.formula} />
              <p className="small muted">{lesson.concept.terms}</p>
              <div className="worked-example">
                <span className="eyebrow">A WORKED EXAMPLE</span>
                <h3>{lesson.worked.problem}</h3>
                <ol>
                  {lesson.worked.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
                <div className="worked-answer">{lesson.worked.answer}</div>
              </div>
            </>
          )}
          {stage === 3 && (
            <>
              <h2>Make the reasoning your own.</h2>
              <p>
                Start with one guided question, then work independently. Hints
                and retries remain visible in your evidence.
              </p>
              {questions(["guided", "independent"])}
            </>
          )}
          {stage === 4 && (
            <>
              <h2>Take the idea somewhere new.</h2>
              <p>
                The setting has changed. Identify the underlying relationship
                and the conditions that make it valid.
              </p>
              {questions(["transfer"])}
              <div className="reflection-prompt">
                <span className="eyebrow">THINK BEYOND THE ANSWER</span>
                <p>
                  Explain the principle without mentioning your original
                  interest. Which assumptions did you check before choosing a
                  method?
                </p>
                <span className="small muted">
                  Use your notebook for the explanation. Only the numerical
                  response is assessed here.
                </span>
              </div>
            </>
          )}
          {stage === 5 && (
            <>
              <div className="review-heading">
                <CalendarClock size={32} />
                <h2>
                  {complete
                    ? "Build understanding that lasts."
                    : "There’s more evidence to gather."}
                </h2>
              </div>
              <p>
                {complete
                  ? "You have answered the five learning checks. Completion records this learning sequence; it does not certify chapter mastery."
                  : "Return to the learning checks and complete each one. Your review will be scheduled after all five have a successful answer."}
              </p>
              <div className="review-checklist">
                {lesson.questions
                  .filter((q) => q.kind !== "delayed")
                  .map((q) => (
                    <div key={q.id}>
                      {answers.some((a) => a.id === q.id) ? (
                        <Check size={17} />
                      ) : (
                        <Circle size={17} />
                      )}
                      <span>
                        {q.kind === "diagnostic" ? "Prerequisite" : q.kind}{" "}
                        check
                      </span>
                      <span>
                        {answers.some((a) => a.id === q.id)
                          ? answers.find((a) => a.id === q.id)?.assisted
                            ? "With support / retry"
                            : "Unaided first pass"
                          : "Not completed"}
                      </span>
                    </div>
                  ))}
              </div>
              {reviewed && (
                <div className="feedback success">
                  Your delayed review answer has been recorded. Further unseen
                  questions are needed to establish broader retention.
                </div>
              )}
              {(reviewed || (reviewDue !== null && reviewDue <= Date.now())) &&
                questions(["delayed"])}
              {!reviewed && reviewDue !== null && reviewDue > Date.now() && (
                <div className="info-banner">
                  <strong>Return for delayed recall</strong>
                  <span>
                    Your review opens on{" "}
                    {new Date(reviewDue).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: "UTC",
                    })}{" "}
                    UTC. Giving it time helps distinguish recall from immediate
                    familiarity.
                  </span>
                </div>
              )}
              <div className="next-objective">
                <span className="eyebrow">WHERE THIS CONCEPT LEADS</span>
                <p>{lesson.extension}</p>
              </div>
              <Link href="/progress" className="button secondary">
                View learning evidence <ArrowRight size={16} />
              </Link>
              <Link href="/journey" className="button secondary">
                Choose my next step <ArrowRight size={16} />
              </Link>
            </>
          )}
          <div className="lesson-navigation">
            <button
              className="button secondary"
              disabled={stage === 0 || pending}
              onClick={() => navigate(stage - 1)}
            >
              <ArrowLeft size={15} /> Previous
            </button>
            {stage < 5 && (
              <button
                className="button"
                disabled={pending}
                onClick={() => navigate(stage + 1)}
              >
                Continue <ArrowRight size={15} />
              </button>
            )}
          </div>
        </div>
        <TextCoach
          lessonId={lesson.id}
          prompts={coachPrompts}
          initialHistory={coachHistory}
          authenticated={authenticated}
        />
      </div>
    </>
  );
}
