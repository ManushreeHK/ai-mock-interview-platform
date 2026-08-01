import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { WeeklyScore } from "../../utils/dashboardMetrics";
import { useTheme } from "../../theme/useTheme";

export default function WeeklyProgress({ data }: { data: WeeklyScore[] }) {
  const { resolvedTheme } = useTheme();
  const chart = resolvedTheme === "dark"
    ? { grid: "#334155", tick: "#cbd5e1", tooltip: "#0f172a", border: "#475569", text: "#f8fafc" }
    : { grid: "#e2e8f0", tick: "#64748b", tooltip: "#ffffff", border: "#e2e8f0", text: "#0f172a" };
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Weekly Progress
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Interview scores over the last 7 days
        </p>
      </div>

      <div className="h-80">
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
              strokeWidth={4}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
