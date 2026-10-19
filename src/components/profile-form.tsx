"use client";
import { useActionState } from "react";
import { saveProfile } from "@/app/actions";
import { interests, goals } from "@/lib/catalog";
import type { Learner } from "@/lib/types";
export function ProfileForm({ user }: { user: Learner }) {
  const [state, action, pending] = useActionState(saveProfile, {});
  return (
    <form action={action} className="profile-form">
      <section className="panel">
        <span className="eyebrow">01 / YOUR DIRECTION</span>
        <h2>A plan that starts with you</h2>
        <div className="form-grid">
          <label>
            Display name
            <input
              name="name"
              defaultValue={user.name}
              maxLength={60}
              required
            />
          </label>
          <label>
            Your grade
            <select name="grade" defaultValue={user.grade}>
              {[8, 9, 10, 11, 12].map((g) => (
                <option value={g} key={g}>
                  Grade {g}
                </option>
              ))}
            </select>
          </label>
          <label className="full-field">
            Learning goal
            <select name="goal" defaultValue={user.goal}>
              {goals.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
            <span className="field-help">
              Your goal shapes subject priorities in your learning route.
              Exam-specific content and readiness scores are not yet available.
            </span>
          </label>
        </div>
      </section>
      <section className="panel">
        <span className="eyebrow">02 / YOUR STARTING POINTS</span>
        <h2>What draws your curiosity?</h2>
        <p>
          Choose the worlds you enjoy. We will suggest a connection only when it
          helps teach the concept.
        </p>
        <div className="interest-options">
          {interests.map((i) => (
            <label key={i} className="interest-option">
              <input
                type="checkbox"
                name="interests"
                value={i}
                defaultChecked={user.interests.includes(i)}
              />
              <span>{i}</span>
            </label>
          ))}
        </div>
        <p className="muted small">
          Preferences guide recommendations. Every lesson also offers a direct
          conceptual route.
        </p>
      </section>
      {state.error && (
        <p className="feedback error" role="alert">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="feedback success" role="status">
          {state.success}
        </p>
      )}
      <button type="submit" className="button" disabled={pending}>
        {pending ? "Saving…" : "Save my learning profile"}
      </button>
    </form>
  );
}
