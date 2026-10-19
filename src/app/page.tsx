import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ArrowUpRight,
  Target,
  CalendarClock,
  CheckCheck,
  Sparkles,
} from "lucide-react";
import { Shell } from "@/components/shell";
import { Orbit } from "@/components/orbit";
import { LessonCard } from "@/components/lesson-card";
import { currentLearner } from "@/lib/auth";
import { getStats } from "@/lib/progress";
import { lessons } from "@/lib/lessons";
import { learningJourney } from "@/lib/journey";
export default async function Home() {
  const user = await currentLearner();
  const stats = getStats(user?.id);
  const next = user ? learningJourney(user, stats.attempts, stats.progress, Date.now())[0] : null;
  const continuing = lessons.find((l) => l.id === stats.progress[0]?.lesson_id);
  const ordered = [...lessons].sort(
    (a, b) =>
      Number(b.contexts.some((c) => user?.interests.includes(c.interest))) -
      Number(a.contexts.some((c) => user?.interests.includes(c.interest))),
  );
  return (
    <Shell>
      <div className="page-heading">
        <div>
          <div className="eyebrow">CURIOSITY, WITH DIRECTION</div>
          <h1>
            {user
              ? `Your next discovery, ${user.name.split(" ")[0]}.`
              : "A familiar world. A new understanding."}
          </h1>
          <p>
            Build the foundations. Connect the ideas. Learn to think beyond the
            example.
          </p>
        </div>
        <span className="edition-label">
          GRADES 8–12 <span> / </span> FOUNDATIONS TO ENTRANCES
        </span>
      </div>
      {!user && (
        <section className="pilot-invite">
          <p>
            <strong>Meet PeduC.</strong> Try a local learning workspace with
            text coaching and your own evidence.
          </p>
          <Link href="/pilot" className="inline-link">
            Try the local pilot <ArrowRight size={16} />
          </Link>
        </section>
      )}
      <section className="hero">
        <div className="hero-copy">
          <span className="hero-eyebrow">
            <span className="status-dot" /> CONTEXT BEFORE CONTENT
          </span>
          <h2>
            Your interests are
            <br />a starting point.
            <br />
            <em>Understanding is the goal.</em>
          </h2>
          <p>
            Explore a concept in a world you know. Build the formal model. Put
            it to work somewhere new.
          </p>
          <Link
            href={user ? "/journey" : "/curriculum"}
            className="button cream"
          >
            {user
              ? "Open my learning route"
              : "Find your first connection"}
            <ArrowRight size={17} />
          </Link>
        </div>
        <Orbit />
        <div className="hero-bottom">
          <span>01 &nbsp; Discover</span>
          <span>02 &nbsp; Understand</span>
          <span>03 &nbsp; Apply</span>
          <span>04 &nbsp; Transfer</span>
        </div>
      </section>
      {next && <section className="pilot-invite" aria-label="Suggested next step">
        <div><span className="eyebrow">SUGGESTED NEXT STEP</span><h3>{next.lesson.title}</h3><p>{next.reason}</p></div>
        <Link href="/journey" className="inline-link">See my route <ArrowRight size={16} /></Link>
      </section>}
      <section className="stats-grid" aria-label="Your learning summary">
        <div className="stat-card">
          <span className="stat-icon">
            <BookOpen size={19} />
          </span>
          <div>
            <strong>
              {stats.completed}
              <small> / {lessons.length}</small>
            </strong>
            <span>Learning sequences completed</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">
            <Target size={19} />
          </span>
          <div>
            <strong>{stats.firstPass}</strong>
            <span>Unaided first-pass answers</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">
            <CalendarClock size={19} />
          </span>
          <div>
            <strong>{stats.due}</strong>
            <span>Delayed reviews due</span>
          </div>
        </div>
      </section>
      <div className="section-heading">
        <div>
          <span className="eyebrow">
            {user ? "CONNECTED TO YOUR CURIOSITY" : "START EXPLORING"}
          </span>
          <h2>
            {continuing
              ? "Keep building your understanding"
              : "Find a meaningful connection"}
          </h2>
        </div>
        <Link href="/curriculum" className="inline-link">
          Browse curriculum <ArrowRight size={16} />
        </Link>
      </div>
      <div className="lesson-grid">
        {ordered.map((l) => (
          <LessonCard
            key={l.id}
            lesson={l}
            interest={
              l.contexts.find((c) => user?.interests.includes(c.interest))
                ?.interest
            }
            resume={stats.progress.some((p) => p.lesson_id === l.id)}
          />
        ))}
      </div>
      <div className="bottom-grid">
        <section className="panel interest-panel">
          <div className="section-heading">
            <div className="icon-heading">
              <Sparkles size={19} />
              <h3>Your world, your starting points</h3>
            </div>
            <Link href="/settings" aria-label="Edit interests">
              <ArrowUpRight size={20} />
            </Link>
          </div>
          <p>We recommend a context only where it helps explain the concept.</p>
          <div className="interest-chips">
            {(user?.interests.length
              ? user.interests
              : ["Cricket", "Cooking", "Gaming", "Design"]
            ).map((i) => (
              <Link href="/settings" className="interest-chip" key={i}>
                {i}
              </Link>
            ))}
          </div>
          <span className="muted small">
            You can always learn the concept directly.
          </span>
        </section>
        <section className="panel evidence-panel">
          <div className="icon-heading">
            <CheckCheck size={20} />
            <h3>Progress that means something</h3>
          </div>
          <p>
            Guided answers, independent attempts, transfer, and delayed recall
            are recorded separately.
          </p>
          <Link href="/progress" className="inline-link">
            See your learning evidence <ArrowRight size={16} />
          </Link>
        </section>
      </div>
      <div className="library-notice">
        <span className="notice-label">LIBRARY STATUS</span>
        <p>
          {lessons.length} development lessons across mathematics, physics,
          chemistry, and biology. Target pathways: JEE, NEET, BITSAT, CUET,
          TS/AP EAMCET, and KCET. Syllabus mappings and examination banks are
          pending.
        </p>
      </div>
    </Shell>
  );
}
