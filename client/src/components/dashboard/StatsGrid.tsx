import { Mic, Trophy, Star, Flame } from "lucide-react";
import StatCard from "./StatCard";
import type { DashboardMetrics } from "../../utils/dashboardMetrics";

export default function StatsGrid({ metrics }: { metrics: DashboardMetrics }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Interviews"
        value={String(metrics.totalInterviews)}
        subtitle={`${metrics.interviewsThisWeek} this week`}
        icon={Mic}
        iconBg="bg-blue-600"
      />

      <StatCard
        title="Average Score"
        value={`${metrics.averageScore.toFixed(1)}/10`}
        subtitle="Across completed interviews"
        icon={Star}
        iconBg="bg-amber-500"
      />

      <StatCard
        title="Best Score"
        value={`${metrics.bestScore.toFixed(1)}/10`}
        subtitle="Personal best"
        icon={Trophy}
        iconBg="bg-emerald-600"
      />

      <StatCard
        title="Current Streak"
        value={`${metrics.currentStreak} ${metrics.currentStreak === 1 ? "Day" : "Days"}`}
        subtitle="Ending today or yesterday"
        icon={Flame}
        iconBg="bg-rose-500"
      />
    </div>
  );
}
