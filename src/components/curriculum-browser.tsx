"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowRight, BookOpen, Map } from "lucide-react";
import { curriculum, subjects } from "@/lib/catalog";
export function CurriculumBrowser() {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("All subjects");
  const [grade, setGrade] = useState("All grades");
  const [available, setAvailable] = useState(false);
  const filtered = useMemo(
    () =>
      curriculum.filter(
        (t) =>
          (subject === "All subjects" || t.subject === subject) &&
          (grade === "All grades" || t.grade === Number(grade)) &&
          (!available || "lesson" in t) &&
          `${t.title} ${t.chapter}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [query, subject, grade, available],
  );
  return (
    <>
      <div className="filter-panel">
        <div className="search-field">
          <Search size={18} />
          <input
            aria-label="Search topics"
            placeholder="Search a concept or chapter…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          aria-label="Filter by subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        >
          {["All subjects", ...subjects].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          aria-label="Filter by grade"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        >
          <option>All grades</option>
          {[8, 9, 10, 11, 12].map((g) => (
            <option key={g} value={g}>
              Grade {g}
            </option>
          ))}
        </select>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
          />{" "}
          Available lessons
        </label>
      </div>
      <div className="results-heading">
        <span>
          {filtered.length} topic{filtered.length === 1 ? "" : "s"}
        </span>
        <span>
          <span className="status-dot" /> Development lessons{" "}
          <span className="roadmap-dot" /> Curriculum roadmap
        </span>
      </div>
      <div className="curriculum-list">
        {filtered.map((topic) => (
          <article className="topic-row" key={topic.id}>
            <div className={`topic-symbol ${topic.subject.toLowerCase()}`}>
              {"lesson" in topic ? <BookOpen size={21} /> : <Map size={21} />}
            </div>
            <div className="topic-info">
              <div className="mini-label">
                {topic.subject} · GRADE {topic.grade} · {topic.chapter}
              </div>
              <h3>{topic.title}</h3>
              <span className="small muted">
                {"lesson" in topic
                  ? "Formal explanation · interactive model · practice · transfer"
                  : "Proposed placement · syllabus mapping and content review pending"}
              </span>
            </div>
            {"lesson" in topic ? (
              <Link
                className="button secondary compact"
                href={`/learn/${topic.lesson}`}
              >
                Open lesson <ArrowRight size={16} />
              </Link>
            ) : (
              <span className="roadmap-badge">Planned</span>
            )}
          </article>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="empty-state">
          <Search size={30} />
          <h3>No topics match these filters</h3>
          <p>Try another subject, grade, or search term.</p>
          <button
            className="button secondary"
            onClick={() => {
              setQuery("");
              setGrade("All grades");
              setSubject("All subjects");
              setAvailable(false);
            }}
          >
            Reset filters
          </button>
        </div>
      )}
    </>
  );
}
