import { Shell } from "@/components/shell";
import { ProfileForm } from "@/components/profile-form";
import { requireLearner } from "@/lib/auth";
export const metadata = { title: "Interests & goals" };
export default async function Settings() {
  const user = await requireLearner();
  return (
    <Shell section="Interests & goals">
      <div className="page-heading">
        <div>
          <div className="eyebrow">YOUR LEARNING PROFILE</div>
          <h1>Start with what moves you.</h1>
          <p>
            Your goals set the direction. Your interests help find a meaningful
            route.
          </p>
        </div>
      </div>
      <ProfileForm user={user} />
    </Shell>
  );
}
