import { Brain, ArrowRight } from "lucide-react";
import { Button } from "../ui";

export default function AIInsights({ insights }: { insights: string[] }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100">
          <Brain className="text-violet-600" size={24} />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900">AI Coach</h3>
          <p className="text-sm text-slate-500">Personalized insights</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-slate-50 p-4">
        {insights.map((insight, index) => (
          <p
            className={
              index === 0
                ? "text-sm leading-7 text-slate-700"
                : "mt-4 text-sm leading-7 text-slate-700"
            }
            key={insight}
          >
            {insight}
          </p>
        ))}
      </div>

      <Button
        fullWidth
        className="mt-6"
        rightIcon={<ArrowRight size={18} />}
      >
        Start Recommended Interview
      </Button>
    </div>
  );
}
