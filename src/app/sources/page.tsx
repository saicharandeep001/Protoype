import { ArrowUpRight, BookOpen } from "lucide-react";
import { Shell } from "@/components/shell";
import { sourceRegistry } from "@/lib/sources";
export const metadata = { title: "Content & coverage" };
export default function Sources() {
  return (
    <Shell section="Content & coverage">
      <div className="page-heading">
        <div>
          <span className="eyebrow">A TRACEABLE CONTENT FOUNDATION</span>
          <h1>Good learning needs good sources.</h1>
          <p>
            The source plan for PeduC’s English-language mathematics, physics,
            chemistry, and biology curriculum.
          </p>
        </div>
      </div>
      <div className="info-banner">
        <strong>Proposed sources, not completed verification.</strong>
        <span>
          The development environment could not access the reference websites.
          The current lessons are original draft explanations, not imported or
          officially endorsed textbook content. The registry below is a research
          starting point; 2027 syllabus mappings and educator review are
          pending.
        </span>
      </div>
      <div className="source-grid">
        {sourceRegistry.map((source) => (
          <article className="panel source-card" key={source.title}>
            <BookOpen size={21} />
            <span className="mini-label">{source.role}</span>
            <h2>{source.title}</h2>
            <p className="source-subjects">{source.subjects}</p>
            <p>{source.use}</p>
            {source.url ? (
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="inline-link"
              >
                Visit source website <ArrowUpRight size={15} />
              </a>
            ) : (
              <span className="roadmap-badge">
                Authority links to be verified
              </span>
            )}
          </article>
        ))}
      </div>
      <section className="panel">
        <span className="eyebrow">
          BEFORE A LESSON IS PUBLISHED FOR STUDENTS
        </span>
        <h2>Map it. Author it. Verify it.</h2>
        <ol className="source-process">
          <li>Identify the exact curriculum objective and source version.</li>
          <li>
            Choose a relevant interest connection and state the model’s limits.
          </li>
          <li>
            Write the formal explanation, worked example, and distinct
            assessment tasks.
          </li>
          <li>
            Have a qualified subject reviewer verify the reasoning, answers, and
            misconceptions.
          </li>
          <li>
            Publish a versioned lesson and track learning evidence separately
            from completion.
          </li>
        </ol>
        <p className="small muted">
          January–February 2027 is the requested pilot window. It does not
          identify the school academic year or guarantee that 2027 examination
          bulletins are already published.
        </p>
      </section>
    </Shell>
  );
}
