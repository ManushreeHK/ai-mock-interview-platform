import { Activity, Flame, Star, Trophy } from "lucide-react";
import type { DashboardMetrics } from "../../utils/dashboardMetrics";

export default function ProgressSummaryCard({ metrics }: { metrics?: DashboardMetrics }) {
  const values = [
    { label: "Interviews", value: metrics ? String(metrics.totalInterviews) : "—", icon: Activity },
    { label: "Average Score", value: metrics ? `${metrics.averageScore.toFixed(1)}/10` : "—", icon: Star },
    { label: "Current Streak", value: metrics ? `${metrics.currentStreak} ${metrics.currentStreak === 1 ? "day" : "days"}` : "—", icon: Flame },
  ];
  const progress = Math.min(100, Math.max(0, (metrics?.bestScore ?? 0) * 10));

  return (
    <section className="flex min-h-64 flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900" aria-labelledby="progress-title">
      <div className="flex items-center justify-between">
        <h2 id="progress-title" className="text-lg font-bold text-slate-900 dark:text-slate-100">Your Progress</h2>
        <span className="rounded-xl bg-blue-50 p-2 text-blue-600 dark:bg-blue-950 dark:text-blue-300"><Trophy className="h-5 w-5" aria-hidden="true" /></span>
      </div>
      <dl className="mt-4 space-y-3">
        {values.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center justify-between text-sm">
            <dt className="flex items-center gap-2 text-slate-500 dark:text-slate-400"><Icon className="h-4 w-4" aria-hidden="true" />{label}</dt>
            <dd className="font-bold text-slate-900 dark:text-slate-100">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-auto pt-5">
        <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400"><span>Best Score</span><span>{metrics ? `${metrics.bestScore.toFixed(1)}/10` : "—"}</span></div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800" role="progressbar" aria-label="Best score" aria-valuemin={0} aria-valuemax={10} aria-valuenow={metrics?.bestScore ?? 0}>
          <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-[width]" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{metrics ? `${metrics.interviewsThisWeek} completed in the last 7 days` : "Loading interview progress"}</p>
      </div>
    </section>
  );
}
