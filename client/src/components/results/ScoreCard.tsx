import type { LucideIcon } from "lucide-react";

type ScoreCardProps = {
  label: string;
  score: number;
  icon: LucideIcon;
  tone: "blue" | "emerald" | "amber" | "violet";
};

const tones = {
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/70 dark:text-blue-300",
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-teal-950/70 dark:text-teal-300",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-950/70 dark:text-amber-300",
  violet: "bg-violet-50 text-violet-600 dark:bg-violet-950/70 dark:text-violet-300",
};

export default function ScoreCard({
  label,
  score,
  icon: Icon,
  tone,
}: ScoreCardProps) {
  return (
    <article className="flex h-full min-h-[6.5rem] items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}
      >
        <Icon size={21} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="min-h-10 whitespace-normal text-[13px] font-medium leading-5 text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
          {score}
          <span className="ml-1 text-sm font-medium text-slate-400 dark:text-slate-500">
            /10
          </span>
        </p>
      </div>
    </article>
  );
}
