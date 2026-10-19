import { currentLearner } from "@/lib/auth";
import { Navigation } from "./navigation";
import { logout } from "@/app/actions";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
export async function Shell({
  children,
  section = "My workspace",
}: {
  children: React.ReactNode;
  section?: string;
}) {
  const learner = await currentLearner();
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navigation />
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            Learning space <ChevronRight size={14} />
            <span>{section}</span>
          </div>
          <div className="topbar-right">
            {learner ? (
              <>
                <span className="grade-pill">Grade {learner.grade}</span>
                <Link
                  href="/settings"
                  className="avatar"
                  aria-label="Your profile"
                >
                  {learner.name.slice(0, 1).toUpperCase()}
                </Link>
                <form action={logout}>
                  <button className="text-button small" type="submit">
                    Sign out
                  </button>
                </form>
              </>
            ) : (
              <Link className="button compact" href="/pilot">
                Try PeduC <ArrowRight size={15} />
              </Link>
            )}
          </div>
        </header>
        <main id="main" className="main-content">
          {children}
        </main>
        <footer className="main-footer">
          PeduC · Context Before Content{" "}
          <span>Development library · Content awaiting educator review</span>
        </footer>
      </div>
    </div>
  );
}
