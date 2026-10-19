"use client";
import { useActionState } from "react";
import { savePilotFeedback } from "@/app/pilot-actions";
export function PilotFeedbackForm() {
  const [state, action, pending] = useActionState(savePilotFeedback, {});
  return (
    <form action={action} className="pilot-feedback">
      <div className="form-grid">
        <label>
          How clear was the explanation?
          <select name="clarity" defaultValue="" required>
            <option value="" disabled>
              Choose a rating
            </option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} / 5 {n === 1 ? "— unclear" : n === 5 ? "— very clear" : ""}
              </option>
            ))}
          </select>
        </label>
        <label>
          Did the interest connection help?
          <select name="relevance" defaultValue="" required>
            <option value="" disabled>
              Choose a rating
            </option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} / 5{" "}
                {n === 1 ? "— not helpful" : n === 5 ? "— very helpful" : ""}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label>
        What worked, and what needs improvement?
        <textarea
          name="note"
          rows={4}
          minLength={10}
          maxLength={2000}
          required
          placeholder="Describe the concept you tried, where you needed help, and whether you could apply it elsewhere."
        />
      </label>
      {state.error && (
        <p role="alert" className="feedback error">
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" className="feedback success">
          {state.success}
        </p>
      )}
      <button className="button" disabled={pending}>
        {pending ? "Saving…" : "Save evaluation feedback"}
      </button>
    </form>
  );
}
