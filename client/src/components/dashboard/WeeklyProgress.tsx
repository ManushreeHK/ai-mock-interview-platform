import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartNoAxesCombined } from "lucide-react";
import type { WeeklyScore } from "../../utils/dashboardMetrics";
import { useTheme } from "../../theme/useTheme";

export default function WeeklyProgress({ data }: { data: WeeklyScore[] }) {
  const { resolvedTheme } = useTheme();
  const chart = resolvedTheme === "dark"
    ? { grid: "#334155", tick: "#cbd5e1", tooltip: "#0f172a", border: "#475569", text: "#f8fafc" }
    : { grid: "#e2e8f0", tick: "#64748b", tooltip: "#ffffff", border: "#e2e8f0", text: "#0f172a" };
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900" aria-labelledby="weekly-progress-title">
      <div className="mb-4">
        <h2 id="weekly-progress-title" className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-slate-100">
          <ChartNoAxesCombined className="h-5 w-5 text-blue-600 dark:text-blue-300" aria-hidden="true" />
          Weekly Progress
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Interview scores over the last 7 days
        </p>
      </div>

      <div className="h-72" role="img" aria-label="Interview scores for the last seven days">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke={chart.grid} strokeDasharray="3 3" />

            <XAxis dataKey="day" tick={{ fill: chart.tick }} axisLine={{ stroke: chart.grid }} tickLine={{ stroke: chart.grid }} />

            <YAxis domain={[0, 10]} tick={{ fill: chart.tick }} axisLine={{ stroke: chart.grid }} tickLine={{ stroke: chart.grid }} />

            <Tooltip contentStyle={{ backgroundColor: chart.tooltip, borderColor: chart.border, color: chart.text, borderRadius: "0.75rem" }} labelStyle={{ color: chart.text }} />

            <Line
              type="monotone"
              dataKey="score"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ fill: "#2563eb", strokeWidth: 0, r: 3 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
