"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { MessageCircle, Send, ArrowUpRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { askCoach } from "@/app/coach-actions";
import type { CoachExchange } from "@/lib/coach-content";

export function TextCoach({
  lessonId,
  prompts,
  initialHistory,
  authenticated,
}: {
  lessonId: string;
  prompts: string[];
  initialHistory: CoachExchange[];
  authenticated: boolean;
}) {
  const [history, setHistory] = useState(initialHistory);
  const [question, setQuestion] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [history, pending]);
  function send(text: string) {
    if (!text.trim() || pending) return;
    setError("");
    startTransition(async () => {
      try {
        const result = await askCoach(lessonId, text);
        if (result.error) setError(result.error);
        else if (result.exchange) {
          setHistory((h) => [...h, result.exchange!]);
          setQuestion("");
        }
      } catch {
        setError("Your question could not be saved. Please try again.");
      }
    });
  }
  return (
    <aside className="text-coach" id="text-coach" aria-label="PeduC text coach">
      <div className="coach-header">
        <span className="coach-avatar">
          <MessageCircle size={21} />
        </span>
        <div>
          <h2>PeduC Coach</h2>
          <span>
            <i className="status-dot" /> Local lesson companion
          </span>
        </div>
      </div>
      <div className="coach-mode">
        <BookOpen size={14} />
        <span>Authored explanations · no AI API</span>
      </div>
      <div
        ref={scrollRef}
        className="coach-transcript"
        role="log"
        aria-label="Coaching conversation"
        aria-live="polite"
        aria-relevant="additions"
      >
        <div className="coach-welcome">
          <strong>Let’s work through the idea.</strong>
          <p>
            Ask about this concept, a model assumption, or the next step. I’ll
            show you which lesson explanation I’m using.
          </p>
        </div>
        {history.map((exchange) => (
          <div className="coach-exchange" key={exchange.id}>
            <div className="coach-question">
              <span>You</span>
              <p>{exchange.question}</p>
            </div>
            <div className="coach-reply">
              <span>PeduC Coach</span>
              <p>{exchange.reply}</p>
              <div className="coach-followup">{exchange.follow_up}</div>
              <small>{exchange.source}</small>
            </div>
          </div>
        ))}
        {pending && (
          <p className="coach-pending" role="status">
            Finding a lesson explanation…
          </p>
        )}
      </div>
      <div className="coach-composer">
        {authenticated ? (
          <>
            <div className="coach-suggestions">
              {prompts.slice(0, 3).map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => send(prompt)}
                  disabled={pending}
                >
                  {prompt}
                  <ArrowUpRight size={12} />
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(question);
              }}
            >
              <label htmlFor="coach-question" className="sr-only">
                Ask the lesson coach
              </label>
              <textarea
                id="coach-question"
                rows={2}
                maxLength={600}
                minLength={3}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What would you like to understand?"
                required
              />
              <button
                className="coach-send"
                type="submit"
                aria-label="Send question"
                disabled={pending || question.trim().length < 3}
              >
                <Send size={17} />
              </button>
            </form>
            {error && (
              <p role="alert" className="feedback error">
                {error}
              </p>
            )}
            <p className="coach-footnote">
              Help during a check is recorded as support. This guide has a
              limited library and may not recognise every question.
            </p>
          </>
        ) : (
          <>
            <p>
              Create a workspace or start a local trial to save your
              conversation and learning evidence.
            </p>
            <Link href="/pilot" className="button secondary full">
              Try the local pilot <ArrowUpRight size={15} />
            </Link>
          </>
        )}
      </div>
    </aside>
  );
}
