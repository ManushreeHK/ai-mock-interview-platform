import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", score: 72 },
  { day: "Tue", score: 81 },
  { day: "Wed", score: 78 },
  { day: "Thu", score: 89 },
  { day: "Fri", score: 92 },
  { day: "Sat", score: 86 },
  { day: "Sun", score: 95 },
];

export default function WeeklyProgress() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          Weekly Performance
        </h2>

        <p className="text-sm text-slate-500">
          Your interview scores this week
        </p>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="day" />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="score"
              stroke="#2563eb"
              strokeWidth={4}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}