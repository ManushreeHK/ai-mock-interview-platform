import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "../ui";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useNavigate } from "react-router-dom";
import type { DashboardMetrics } from "../../utils/dashboardMetrics";

export default function WelcomeBanner({
  metrics,
}: {
  metrics?: DashboardMetrics;
}) {
  const user = useCurrentUser();
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-10 text-white shadow-xl">
      {/* Background Glow */}
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-cyan-400/20 blur-2xl" />

      <div className="relative flex items-center justify-between">
        {/* Left */}
        <div className="max-w-xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm backdrop-blur">
            <Sparkles size={16} />
            AI Powered Mock Interviews
          </div>

          <h1 className="text-5xl font-bold leading-tight">
            Welcome back, {user.displayName} 👋
          </h1>

          <p className="mt-4 text-lg text-blue-100">
            Ready to level up your interview skills today?
            Practice technical, behavioral, and coding interviews
            powered by AI.
          </p>

          <div className="mt-8 flex gap-4">
           <Button
  variant="hero"
  size="lg"
  onClick={() => navigate("/create-interview")}
>
  Start AI Interview
</Button>

            <Button
              variant="ghost"
              size="lg"
              className="border border-white/30 text-white hover:bg-white/10"
            >
              View History
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>

        {/* Right */}
<div className="hidden lg:flex">
  <div className="w-80 rounded-3xl bg-white/10 p-6 backdrop-blur-xl border border-white/20">

    <h3 className="text-xl font-semibold">
      Your Progress
    </h3>

    <div className="mt-6 space-y-4">

      <div className="flex justify-between">
        <span>🔥 Interviews</span>
        <span className="font-bold">{metrics?.totalInterviews ?? "—"}</span>
      </div>

      <div className="flex justify-between">
        <span>⭐ Average Score</span>
        <span className="font-bold">
          {metrics ? `${metrics.averageScore.toFixed(1)}/10` : "—"}
        </span>
      </div>

      <div className="flex justify-between">
        <span>🏆 Current Streak</span>
        <span className="font-bold">
          {metrics ? `${metrics.currentStreak} Days` : "—"}
        </span>
      </div>

    </div>

    <div className="mt-8">
      <div className="flex justify-between text-sm">
        <span>Best Score</span>
        <span>{metrics ? `${metrics.bestScore.toFixed(1)}/10` : "—"}</span>
      </div>

      <div className="mt-2 h-2 rounded-full bg-white/20">
        <div
          className="h-2 rounded-full bg-white"
          style={{ width: `${(metrics?.bestScore ?? 0) * 10}%` }}
        ></div>
      </div>

      <p className="mt-3 text-sm text-blue-100">
        {metrics
          ? `${metrics.interviewsThisWeek} completed in the last 7 days`
          : "Loading your interview history"}
      </p>

    </div>

  </div>
</div>
      </div>
    </section>
  );
}
