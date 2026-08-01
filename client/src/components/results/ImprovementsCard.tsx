import { ArrowUpRight } from "lucide-react";

type ImprovementsCardProps = {
  improvements: string[];
};

export default function ImprovementsCard({
  improvements,
}: ImprovementsCardProps) {
  return (
    <article className="h-full rounded-2xl border border-amber-200 bg-amber-50/60 p-6 dark:border-amber-800/70 dark:bg-amber-950/35">
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
        Areas to improve
      </h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Focus points for your next practice session
      </p>

      <ul className="mt-5 space-y-4">
        {improvements.map((improvement, index) => (
          <li
            key={`${improvement}-${index}`}
            className="flex items-start gap-3 text-sm leading-6 text-slate-700 dark:text-slate-200"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white dark:bg-amber-400 dark:text-amber-950">
              <ArrowUpRight size={13} strokeWidth={3} />
            </span>
            {improvement}
          </li>
        ))}
      </ul>
    </article>
  );
}
