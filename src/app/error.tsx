"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="standalone-state">
      <h1>We couldn’t load this workspace.</h1>
      <p>Please try again. Previously saved answers remain in your account.</p>
      <button onClick={reset} className="button">
        Try again
      </button>
    </main>
  );
}
