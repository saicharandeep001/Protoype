import Link from "next/link";
import { ArrowRight, Route } from "lucide-react";
import { Shell } from "@/components/shell";
import { requireLearner } from "@/lib/auth";
import { getStats } from "@/lib/progress";
import { goalSubjects, learningJourney, type RouteStatus } from "@/lib/journey";
import { openLearningStep } from "@/app/journey-actions";

export const metadata = { title: "My learning route" };
const labels: Record<RouteStatus, string> = {
  review: "Review due", foundation: "Foundation support", continue: "In progress",
  start: "Ready to explore", ahead: "Later-grade preview", waiting: "Recall scheduled", complete: "Sequence recorded",
};
export default async function Journey() {
  const user = await requireLearner();
  const stats = getStats(user.id);
  const route = learningJourney(user, stats.attempts, stats.progress, Date.now());
  return <Shell section="My learning route">
    <div className="page-heading"><div>
      <div className="eyebrow">FOUNDATIONS BEFORE ACCELERATION</div>
      <h1>A clear next step.</h1>
      <p>Your evidence sets the order. Your interests help the concept make sense.</p>
    </div><Link href="/settings" className="button secondary">Edit grade & goal</Link></div>
    <section className="panel journey-profile">
      <Route size={25} aria-hidden="true" />
      <div><h2>Grade {user.grade} · {user.goal}</h2>
      <p>Subject focus: {goalSubjects(user.goal).join(", ")}.</p>
      <p className="small muted">Due reviews come first, followed by unresolved prerequisite checks, unfinished lessons, and new starting points. Grade and subject focus order new lessons; interests choose suitable contexts.</p>
      {!["CBSE + JEE", "CBSE + NEET", "CBSE foundations"].includes(user.goal) &&
        <p className="small muted">Your programme-specific subject combination is not configured. All four subjects remain available; this is not an exam syllabus prescription.</p>}
      </div>
    </section>
    <div className="section-heading"><div><span className="eyebrow">YOUR AVAILABLE ROUTE</span><h2>Build one concept at a time</h2></div></div>
    <ol className="journey-list">
      {route.map((item, index) => <li key={item.lesson.id} className="panel journey-card" data-route-lesson={item.lesson.id} data-route-status={item.status}>
        <span className="journey-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        <div className="journey-copy">
          <span className="eyebrow">{labels[item.status]} · {item.lesson.subject} · Grade {item.lesson.grade}</span>
          <h3>{item.lesson.title}</h3><p>{item.reason}</p>
          <p className="small"><strong>Building blocks:</strong> {item.lesson.prerequisites.join(" · ")}</p>
          {item.context && <p className="small"><strong>{item.context.interest} connection:</strong> {item.context.connection}</p>}
          {item.status === "waiting" && item.reviewDue !== null && <p className="small">Recall opens {new Date(item.reviewDue).toLocaleString("en-IN", { timeZone: "UTC", dateStyle: "medium", timeStyle: "short" })} UTC.</p>}
          <form action={openLearningStep.bind(null, item.lesson.id, item.step)}>
            <button className={`button ${index ? "secondary" : ""}`}>{item.action}<ArrowRight size={16} /></button>
          </form>
        </div>
      </li>)}
    </ol>
    <div className="library-notice"><span className="notice-label">ROUTE LIMITS</span><p>This route uses four draft lessons and one prerequisite check per lesson. It cannot assess every foundation or provide full grades 8–12 or entrance-exam coverage. <Link href="/curriculum">See the planned curriculum</Link> and <Link href="/sources">source verification status</Link>.</p></div>
  </Shell>;
}
