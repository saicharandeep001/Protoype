import Link from "next/link";
import {
  ArrowUpRight,
  Clock3,
  MoveUpRight,
  FlaskConical,
  Pi,
  Sprout,
} from "lucide-react";
import type { Lesson } from "@/lib/types";
export function LessonCard({
  lesson,
  interest,
  resume = false,
}: {
  lesson: Lesson;
  interest?: string;
  resume?: boolean;
}) {
  const Icon =
    lesson.subject === "Mathematics"
      ? Pi
      : lesson.subject === "Physics"
        ? MoveUpRight
        : lesson.subject === "Biology"
          ? Sprout
          : FlaskConical;
  const context =
    lesson.contexts.find((c) => c.interest === interest) || lesson.contexts[0];
  return (
    <Link
      href={`/learn/${lesson.id}`}
      className={`lesson-card ${lesson.subject.toLowerCase()}`}
    >
      <div className="lesson-card-top">
        <span className="subject-icon">
          <Icon size={22} />
        </span>
        <span className="mini-label">
          GRADE {lesson.grade} · {lesson.subject.toUpperCase()}
        </span>
        <ArrowUpRight className="card-arrow" size={20} />
      </div>
      <div className="context-caption">
        {context.interest} → {lesson.subject}
      </div>
      <h3>{lesson.title}</h3>
      <p>{lesson.subtitle}</p>
      <div className="card-bottom">
        <span>
          <Clock3 size={14} /> About {lesson.minutes} min
        </span>
        <span>{resume ? "Continue lesson" : "Explore lesson"} →</span>
      </div>
    </Link>
  );
}
