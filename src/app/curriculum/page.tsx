import { Shell } from "@/components/shell";
import { CurriculumBrowser } from "@/components/curriculum-browser";
export const metadata = { title: "Curriculum" };
export default function Curriculum() {
  return (
    <Shell section="Curriculum">
      <div className="page-heading">
        <div>
          <div className="eyebrow">THE KNOWLEDGE MAP</div>
          <h1>Concepts with a clear destination.</h1>
          <p>
            Mathematics, physics, chemistry, and biology · Grades 8–12 · English
          </p>
        </div>
      </div>
      <div className="info-banner">
        <strong>A transparent view of coverage.</strong>
        <span>
          Four development lessons can be explored now. The remaining entries
          are an initial roadmap, not an exhaustive or verified syllabus.
          Exam-specific banks are not yet available.
        </span>
      </div>
      <CurriculumBrowser />
    </Shell>
  );
}
