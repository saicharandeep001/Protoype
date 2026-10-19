"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ChartNoAxesCombined,
  Compass,
  SlidersHorizontal,
  ArrowUpRight,
  FlaskConical,
  Route,
} from "lucide-react";
const links = [
  { href: "/", label: "My workspace", icon: Compass },
  { href: "/journey", label: "My learning route", icon: Route },
  { href: "/curriculum", label: "Curriculum", icon: BookOpen },
  { href: "/progress", label: "Learning evidence", icon: ChartNoAxesCombined },
  { href: "/settings", label: "My interests & goals", icon: SlidersHorizontal },
  { href: "/pilot", label: "Local pilot", icon: FlaskConical },
];
export function Navigation() {
  const path = usePathname();
  return (
    <aside className="sidebar">
      <Link href="/" className="brand" aria-label="PeduC home">
        <span className="brand-symbol">
          <span className="brand-initial">P</span>
        </span>
        <span>
          PeduC<span className="brand-small">CONTEXT BEFORE CONTENT</span>
        </span>
      </Link>
      <div className="nav-caption">YOUR LEARNING SPACE</div>
      <nav aria-label="Main navigation">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            aria-label={label}
            className={
              path === href ||
              (href === "/curriculum" && path.startsWith("/learn"))
                ? "nav-link selected"
                : "nav-link"
            }
            aria-current={path === href ? "page" : undefined}
          >
            <Icon size={19} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
      <div className="sidebar-note">
        <span className="mini-label">THE METHOD</span>
        <h3>
          Make it familiar.
          <br />
          Make it understood.
        </h3>
        <p>
          Connect an interest to a concept. Then take the concept somewhere new.
        </p>
        <Link href="/curriculum">
          Explore the library <ArrowUpRight size={16} />
        </Link>
      </div>
      <div className="sidebar-foot">
        <span className="status-dot" /> Local pilot edition <span>02</span>
      </div>
    </aside>
  );
}
