import { Check } from "lucide-react";

type StrengthsCardProps = {
  strengths: string[];
};

export default function StrengthsCard({
  strengths,
}: StrengthsCardProps) {
  return (
    <article className="h-full rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 dark:border-emerald-800/70 dark:bg-emerald-950/40">
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
        What you did well
      </h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Strengths demonstrated during this interview
      </p>

      <ul className="mt-5 space-y-4">
        {strengths.map((strength, index) => (
          <li
            key={`${strength}-${index}`}
            className="flex items-start gap-3 text-sm leading-6 text-slate-700 dark:text-slate-200"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white dark:bg-emerald-400 dark:text-emerald-950">
              <Check size={13} strokeWidth={3} />
            </span>
            {strength}
          </li>
        ))}
      </ul>
    </article>
  );
}
