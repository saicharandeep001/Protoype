"use client";
import { useState, useTransition } from "react";
import { Check, Lightbulb, ArrowRight } from "lucide-react";
import { revealHint, submitAnswer, type AnswerResult } from "@/app/actions";
import type { Question } from "@/lib/types";
import { foundations } from "@/lib/foundations";
export type PublicQuestion = Pick<Question, "id" | "kind" | "prompt" | "unit">;
export function QuestionCard({
  lessonId,
  question,
  completed,
  assisted,
  onSuccess,
}: {
  lessonId: string;
  question: PublicQuestion;
  completed: boolean;
  assisted: boolean;
  onSuccess: (id: string, assisted: boolean, reviewDue?: number | null) => void;
}) {
  const [answer, setAnswer] = useState("");
  const [hint, setHint] = useState("");
  const [result, setResult] = useState<AnswerResult>({});
  const [pending, startTransition] = useTransition();
  const [foundationOpen, setFoundationOpen] = useState(false);
  const foundation = question.kind === "diagnostic" ? foundations[lessonId] : undefined;
  return (
    <article
      data-question-id={question.id}
      className={`question-card ${completed ? "question-complete" : ""}`}
    >
      <div className="question-heading">
        <span className="mini-label">
          {question.kind === "diagnostic"
            ? "PREREQUISITE CHECK"
            : question.kind === "delayed"
              ? "DELAYED RECALL"
              : `${question.kind.toUpperCase()} PRACTICE`}
        </span>
        {completed && (
          <span className="answer-status">
            <Check size={14} />{" "}
            {assisted ? "With support / retry" : "Unaided first pass"}
          </span>
        )}
      </div>
      <h3>{question.prompt}</h3>
      {!completed && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            startTransition(async () => {
              try {
                const response = await submitAnswer(
                  lessonId,
                  question.id,
                  answer,
                );
                setResult(response);
                if (response.correct === false && foundation) setFoundationOpen(true);
                if (response.correct)
                  onSuccess(
                    question.id,
                    !!response.assisted,
                    response.reviewDue,
                  );
              } catch {
                setResult({
                  error: "Your answer could not be saved. Please try again.",
                });
              }
            });
          }}
        >
          <label className="answer-label" htmlFor={question.id}>
            Your answer{question.unit && <span> · {question.unit}</span>}
          </label>
          <div className="answer-controls">
            <input
              id={question.id}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              autoComplete="off"
              maxLength={100}
              required
              placeholder="Number or fraction"
            />
            <button className="button" disabled={pending}>
              {pending ? "Saving…" : "Check answer"}
              <ArrowRight size={15} />
            </button>
          </div>
          <button
            type="button"
            className="hint-button"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                try {
                  const response = await revealHint(lessonId, question.id);
                  setHint(response.hint || response.error || "");
                } catch {
                  setResult({
                    error: "The hint could not be loaded. Please try again.",
                  });
                }
              })
            }
          >
            <Lightbulb size={15} /> Show a hint{" "}
            <span>· records support used</span>
          </button>
          {foundation && <button type="button" className="hint-button" disabled={pending}
            onClick={() => startTransition(async () => {
              try {
                const response = await revealHint(lessonId, question.id);
                if (response.error) setResult({ error: response.error });
                else setFoundationOpen(true);
              } catch {
                setResult({ error: "The foundation explanation could not be loaded. Please try again." });
              }
            })}>
            <Lightbulb size={15} /> Revisit the foundation <span>· records support used</span>
          </button>}
        </form>
      )}
      {foundationOpen && foundation && <aside className="foundation-repair" aria-label="Foundation explanation">
        <span className="eyebrow">REBUILD THE IDEA</span>
        <h4>{foundation.title}</h4>
        <p>{foundation.explanation}</p>
        <p><strong>A different example:</strong> {foundation.example}</p>
        <p><strong>Before you retry:</strong> {foundation.check}</p>
        <span className="small muted">This explanation supports the check above; it does not assess every prerequisite. A supported retry remains recorded as supported.</span>
      </aside>}
      {hint && !completed && (
        <div className="feedback hint" role="status">
          {hint}
        </div>
      )}
      {result.error && (
        <div className="feedback error" role="alert">
          {result.error}
        </div>
      )}
      {result.explanation && (
        <div
          className={`feedback ${result.correct ? "success" : "hint"}`}
          role="status"
        >
          <strong>{result.correct ? "Correct. " : "Not yet. "}</strong>
          {result.explanation}
          {!result.correct && (
            <p className="small">
              Your next attempt will be recorded as a retry, not an unaided
              first pass.
            </p>
          )}
        </div>
      )}
      {completed && !result.explanation && (
        <p className="small muted">
          Your successful answer is saved. This question will not be counted
          again as fresh evidence.
        </p>
      )}
    </article>
  );
}
