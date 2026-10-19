import Link from "next/link";
export default function NotFound() {
  return (
    <main className="standalone-state">
      <span className="eyebrow">PAGE NOT FOUND</span>
      <h1>This path is still uncharted.</h1>
      <p>Return to the curriculum to find an available lesson.</p>
      <Link href="/curriculum" className="button">
        Browse curriculum
      </Link>
    </main>
  );
}
