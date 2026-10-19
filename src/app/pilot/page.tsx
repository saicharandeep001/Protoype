import Link from "next/link";
import {
  ArrowRight,
  Download,
  Play,
  ClipboardCheck,
  MessageCircle,
  Compass,
} from "lucide-react";
import { Shell } from "@/components/shell";
import { currentLearner } from "@/lib/auth";
import { getEvaluation, getFeedback, localDemoEnabled } from "@/lib/pilot";
import { startLocalTrial } from "@/app/pilot-actions";
import { PilotFeedbackForm } from "@/components/pilot-feedback";
export const metadata = { title: "Local pilot" };
export default async function Pilot() {
  const user = await currentLearner();
  const enabled = localDemoEnabled();
  const report = user ? getEvaluation(user) : null;
  const feedback = user ? getFeedback(user.id) : [];
  return (
    <Shell section="Local pilot">
      <div className="page-heading">
        <div>
          <span className="eyebrow">PEDUC / EXPLORE. TEST. GIVE FEEDBACK.</span>
          <h1>Try the idea. See the evidence.</h1>
          <p>
            A working local evaluation for educators, innovation cells, and
            potential sponsors.
          </p>
        </div>
        <span className="pilot-target">Pilot target · Jan–Feb 2027</span>
      </div>
      <section className="pilot-intro">
        <div>
          <span className="eyebrow">FOUR SUBJECTS. ONE LEARNING JOURNEY.</span>
          <h2>
            From a familiar interest
            <br />
            to independent understanding.
          </h2>
          <p>
            Try a lesson, investigate a model, ask the text coach a question,
            and solve a new problem. Your own attempts become the evidence you
            can inspect.
          </p>
          <div className="pilot-actions">
            {user ? (
              <Link className="button" href="/curriculum">
                Continue exploring <ArrowRight size={16} />
              </Link>
            ) : enabled ? (
              <form action={startLocalTrial}>
                <button className="button">
                  <Play size={15} /> Start a local trial
                </button>
              </form>
            ) : (
              <Link href="/login" className="button">
                Create a test workspace <ArrowRight size={16} />
              </Link>
            )}
            <Link href="/sources" className="button secondary">
              Content & coverage
            </Link>
          </div>
          <p className="small muted">
            {enabled
              ? "No email, domain, or API key needed. A trial has its own empty learning record."
              : "Local trials are disabled on this instance. A regular test account can still use the lessons."}
          </p>
        </div>
        <div className="pilot-scope">
          <span className="mini-label">WHAT YOU CAN TEST TODAY</span>
          <strong>
            4 subjects <span>24 learning checks</span>
          </strong>
          <ul>
            <li>Mathematics · proportional reasoning</li>
            <li>Physics · projectile motion</li>
            <li>Chemistry · reaction ratios</li>
            <li>Biology · inheritance</li>
          </ul>
          <span>English · draft lessons · local text guide</span>
        </div>
      </section>
      <div className="pilot-steps">
        {[
          {
            icon: Compass,
            title: "1. Choose a connection",
            text: "Open a lesson and select a relevant interest, or use the direct conceptual route.",
          },
          {
            icon: MessageCircle,
            title: "2. Ask and investigate",
            text: "Use the interactive model and text coach. Explanations identify their lesson source.",
          },
          {
            icon: ClipboardCheck,
            title: "3. Apply and inspect",
            text: "Answer without help where you can, inspect the evidence, and return for delayed recall.",
          },
        ].map(({ icon: Icon, title, text }) => (
          <section className="panel" key={title}>
            <Icon size={22} />
            <h3>{title}</h3>
            <p>{text}</p>
          </section>
        ))}
      </div>
      <div className="info-banner">
        <strong>What this evaluation establishes</strong>
        <span>
          It can show whether the workflow is usable and where a tester needed
          help. Four draft lessons and personal feedback do not prove improved
          exam performance. Learning efficacy needs educator review, comparable
          baseline assessments, and delayed unseen problems.
        </span>
      </div>
      {report && (
        <section className="panel evaluation-summary">
          <div className="section-heading">
            <div>
              <span className="eyebrow">YOUR OBSERVED SESSION</span>
              <h2>Actual activity. No sample scores.</h2>
            </div>
            <a
              className="button secondary compact"
              href="/api/evaluation/export"
            >
              <Download size={15} /> Export my evaluation
            </a>
          </div>
          <div className="pilot-metrics">
            <div>
              <strong>{report.summary.recorded_attempts}</strong>
              <span>Recorded attempts</span>
            </div>
            <div>
              <strong>{report.summary.unaided_first_pass_answers}</strong>
              <span>Unaided first passes</span>
            </div>
            <div>
              <strong>{report.summary.coaching_exchanges}</strong>
              <span>Coach exchanges</span>
            </div>
            <div>
              <strong>{report.summary.completed_sequences} / 4</strong>
              <span>Sequences completed</span>
            </div>
          </div>
          <p className="small muted">
            The JSON export contains only this account’s attempts, conversation,
            and feedback. It excludes credentials. Review it before sharing.
          </p>
          {user?.is_demo ? (
            <p className="small muted">
              This trial is tied to this browser session. Export your report
              before signing out; there is no email recovery for trial profiles.
            </p>
          ) : null}
        </section>
      )}
      <section className="panel">
        <span className="eyebrow">HELP SHAPE THE NEXT BUILD</span>
        <h2>Record what you noticed.</h2>
        {user ? (
          <>
            <PilotFeedbackForm />
            {feedback.length > 0 && (
              <div className="saved-feedback">
                <h3>Your saved observations</h3>
                {feedback.slice(0, 5).map((f) => (
                  <article key={f.id}>
                    <span>
                      Clarity {f.clarity}/5 · Interest relevance {f.relevance}/5
                    </span>
                    <p>{f.note}</p>
                  </article>
                ))}
              </div>
            )}
          </>
        ) : (
          <p>
            Start a local trial to save feedback and export your evaluation. No
            data is sent to a sponsor automatically.
          </p>
        )}
      </section>
    </Shell>
  );
}
