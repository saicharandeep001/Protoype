import { Shell } from "@/components/shell";
import { AuthForm } from "@/components/auth-form";
import { Orbit } from "@/components/orbit";
export const metadata = { title: "Your workspace" };
export default function Login() {
  return (
    <Shell section="Your workspace">
      <div className="auth-layout">
        <div className="auth-intro">
          <span className="eyebrow">YOUR CURIOSITY. YOUR JOURNEY.</span>
          <h1>
            Learn something.
            <br />
            <em>Understand why.</em>
          </h1>
          <p>A place for the questions that lead to deeper understanding.</p>
          <Orbit />
        </div>
        <AuthForm />
      </div>
    </Shell>
  );
}
