import type { LucideIcon } from "lucide-react";

type ScoreCardProps = {
  label: string;
  score: number;
  icon: LucideIcon;
  tone: "blue" | "emerald" | "amber" | "violet";
};

const tones = {
  blue: "bg-blue-50 text-blue-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  violet: "bg-violet-50 text-violet-600",
};

export default function ScoreCard({
  label,
  score,
  icon: Icon,
  tone,
}: ScoreCardProps) {
  return (
    <article className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}
      >
        <Icon size={21} />
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-500">
          {label}
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900">
          {score}
          <span className="ml-1 text-sm font-medium text-slate-400">
            /10
          </span>
        </p>
      </div>
    </article>
  );
}
