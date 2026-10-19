import Link from "next/link";
import { ArrowRight, ChartNoAxesCombined, CalendarClock } from "lucide-react";
import { Shell } from "@/components/shell";
import { currentLearner } from "@/lib/auth";
import { getStats } from "@/lib/progress";
export const metadata = { title: "Learning evidence" };
export default async function ProgressPage() {
  const user = await currentLearner();
  const stats = getStats(user?.id);
  return (
    <Shell section="Learning evidence">
      <div className="page-heading">
        <div>
          <span className="eyebrow">BEYOND A COMPLETION BAR</span>
          <h1>See what your learning shows.</h1>
          <p>
            Keep practice, independent reasoning, transfer, and recall in
            perspective.
          </p>
        </div>
      </div>
      <div className="info-banner">
        <strong>Evidence, not a mastery certificate.</strong>
        <span>
          A small set of questions cannot establish complete topic mastery.
          Hinted answers and successful retries are recorded separately from
          unaided first attempts.
        </span>
      </div>
      {!user ? (
        <div className="empty-state">
          <ChartNoAxesCombined size={32} />
          <h2>Your learning evidence starts here.</h2>
          <p>
            Create a workspace to record real attempts. No sample scores are
            shown as your progress.
          </p>
          <Link href="/login" className="button">
            Create workspace <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <>
          <div className="evidence-grid">
            {stats.evidence.map((e) => {
              const p = stats.progress.find((p) => p.lesson_id === e.lesson.id);
              return (
                <section key={e.lesson.id} className="panel evidence-detail">
                  <span className="eyebrow">{e.lesson.subject}</span>
                  <h2>{e.lesson.title}</h2>
                  <div className="evidence-number">
                    {e.firstPass}
                    <span> / {e.independentTotal}</span>
                  </div>
                  <p>
                    Independent and transfer questions answered correctly on an
                    unaided first attempt.
                  </p>
                  <div className="evidence-lines">
                    <span>
                      Learning sequence
                      <strong>
                        {e.complete
                          ? "Completed"
                          : e.attempted
                            ? "In progress"
                            : "Not started"}
                      </strong>
                    </span>
                    <span>
                      Delayed recall
                      <strong>
                        {e.retained
                          ? "Unaided answer recorded"
                          : e.lesson.questions.some(
                                (q) =>
                                  q.kind === "delayed" &&
                                  stats.attempts.some(
                                    (a) =>
                                      a.lesson_id === e.lesson.id &&
                                      a.question_id === q.id,
                                  ),
                              )
                            ? "Needs further evidence"
                            : "Not yet assessed"}
                      </strong>
                    </span>
                  </div>
                  {p?.review_due && (
                    <p className="review-date">
                      <CalendarClock size={15} />
                      {p.review_due <= Date.now()
                        ? "Review is due now"
                        : `Review opens ${new Date(p.review_due).toLocaleDateString("en-IN", { timeZone: "UTC" })} UTC`}
                    </p>
                  )}
                  <Link className="inline-link" href={`/learn/${e.lesson.id}`}>
                    {e.attempted ? "Return to lesson" : "Start lesson"}
                    <ArrowRight size={16} />
                  </Link>
                </section>
              );
            })}
          </div>
          <section className="panel">
            <h2>Recent attempts</h2>
            {stats.attempts.length === 0 ? (
              <p className="muted">
                No answers recorded yet. Start with a prerequisite check in any
                available lesson.
              </p>
            ) : (
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Lesson</th>
                      <th>Check</th>
                      <th>Answer</th>
                      <th>Outcome</th>
                      <th>Support</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...stats.attempts]
                      .reverse()
                      .slice(0, 20)
                      .map((a) => (
                        <tr key={a.id}>
                          <td>
                            {
                              stats.evidence.find(
                                (e) => e.lesson.id === a.lesson_id,
                              )?.lesson.title
                            }
                          </td>
                          <td>
                            {
                              stats.evidence
                                .find((e) => e.lesson.id === a.lesson_id)
                                ?.lesson.questions.find(
                                  (q) => q.id === a.question_id,
                                )?.kind
                            }
                          </td>
                          <td>{a.answer}</td>
                          <td>
                            <span
                              className={
                                a.correct
                                  ? "outcome-correct"
                                  : "outcome-revisit"
                              }
                            >
                              {a.correct ? "Correct" : "Revisit"}
                            </span>
                          </td>
                          <td>
                            {a.assisted ? "Guided / hint / retry" : "Unaided"}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </Shell>
  );
}
