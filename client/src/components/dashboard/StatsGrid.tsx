import { Mic, Trophy, Star, Flame } from "lucide-react";
import StatCard from "./StatCard";
import type { DashboardMetrics } from "../../utils/dashboardMetrics";

export default function StatsGrid({ metrics }: { metrics: DashboardMetrics }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Interviews"
        value={String(metrics.totalInterviews)}
        subtitle={`${metrics.interviewsThisWeek} this week`}
        icon={Mic}
        iconBg="bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300"
      />

      <StatCard
        title="Average Score"
        value={`${metrics.averageScore.toFixed(1)}/10`}
        subtitle="Across completed interviews"
        icon={Star}
        iconBg="bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-300"
      />

      <StatCard
        title="Best Score"
        value={`${metrics.bestScore.toFixed(1)}/10`}
        subtitle="Personal best"
        icon={Trophy}
        iconBg="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300"
      />

      <StatCard
        title="Current Streak"
        value={`${metrics.currentStreak} ${metrics.currentStreak === 1 ? "Day" : "Days"}`}
        subtitle="Ending today or yesterday"
        icon={Flame}
        iconBg="bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300"
      />
    </div>
  );
}
