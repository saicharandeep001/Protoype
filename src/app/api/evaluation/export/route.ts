import { currentLearner } from "@/lib/auth";
import { getEvaluation } from "@/lib/pilot";
export const dynamic = "force-dynamic";
export async function GET() {
  const user = await currentLearner();
  if (!user)
    return Response.json(
      { error: "Sign in or start a local trial first." },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  return new Response(JSON.stringify(getEvaluation(user), null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": 'attachment; filename="peduc-evaluation.json"',
      "Cache-Control": "private, no-store",
    },
  });
}
