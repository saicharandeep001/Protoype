"use client";
import { useActionState, useState } from "react";
import { authenticate } from "@/app/actions";
import { ArrowRight } from "lucide-react";
export function AuthForm() {
  const [mode, setMode] = useState("register");
  const [state, action, pending] = useActionState(authenticate, {});
  return (
    <div className="auth-card">
      <div className="segmented">
        <button
          type="button"
          className={mode === "register" ? "active" : ""}
          onClick={() => setMode("register")}
        >
          Create workspace
        </button>
        <button
          type="button"
          className={mode === "login" ? "active" : ""}
          onClick={() => setMode("login")}
        >
          Sign in
        </button>
      </div>
      <h2>
        {mode === "register" ? "Make room for understanding." : "Welcome back."}
      </h2>
      <p>
        Save your learning journey and return to the concepts that need another
        look.
      </p>
      <form action={action}>
        <input type="hidden" name="mode" value={mode} />
        {mode === "register" && (
          <label>
            Display name
            <input
              name="name"
              autoComplete="nickname"
              maxLength={60}
              required
              placeholder="What should we call you?"
            />
          </label>
        )}
        <label>
          Username
          <input
            name="username"
            autoComplete="username"
            minLength={3}
            maxLength={32}
            pattern="[a-zA-Z0-9_]{3,32}"
            required
            placeholder="Choose a username"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            autoComplete={
              mode === "register" ? "new-password" : "current-password"
            }
            minLength={12}
            maxLength={128}
            required
            placeholder="At least 12 characters"
          />
        </label>
        {mode === "register" && (
          <label className="checkbox-label acknowledgement">
            <input type="checkbox" name="acknowledgement" required />
            <span>
              I understand this is a development workspace with draft
              instructional content. I will use a test profile.
            </span>
          </label>
        )}
        {state.error && (
          <p className="feedback error" role="alert">
            {state.error}
          </p>
        )}
        <button className="button full" disabled={pending}>
          {pending
            ? "Please wait…"
            : mode === "register"
              ? "Create my workspace"
              : "Sign in"}
          <ArrowRight size={17} />
        </button>
      </form>
      <p className="small muted">
        Accounts and learning records are stored on this instance. Account
        recovery and managed identity are not connected yet.
      </p>
    </div>
  );
}
