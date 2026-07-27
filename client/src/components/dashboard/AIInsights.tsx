import { Bot, CheckCircle2 } from "lucide-react";

export default function AIInsights() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-blue-100 p-3">
          <Bot className="text-blue-600" />
        </div>

        <div>
          <h2 className="text-xl font-bold">
            AI Coach
          </h2>

          <p className="text-sm text-slate-500">
            Personalized suggestions
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {[
          "Confidence improved by 8%",
          "Practice behavioral interviews",
          "Speak slightly slower",
          "Great technical knowledge",
        ].map((item) => (
          <div
            key={item}
            className="flex items-center gap-3"
          >
            <CheckCircle2
              className="text-green-500"
              size={18}
            />

            <span className="text-slate-700">
              {item}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <p className="mb-2 text-sm font-medium">
          Interview Readiness
        </p>

        <div className="h-3 rounded-full bg-slate-200">
          <div className="h-3 w-[84%] rounded-full bg-blue-600" />
        </div>

        <p className="mt-2 text-sm text-slate-500">
          84% Ready
        </p>
      </div>
    </div>
  );
}