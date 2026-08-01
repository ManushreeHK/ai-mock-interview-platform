import { CheckCircle2 } from "lucide-react";

type ResultsHeroProps = {
  role: string;
  interviewType: string;
  difficulty: string;
  overallScore: number;
};

export default function ResultsHero({
  role,
  interviewType,
  difficulty,
  overallScore,
}: ResultsHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-blue-200/80 bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 px-5 py-8 text-slate-950 shadow-sm dark:border-blue-900/70 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 dark:text-white sm:px-10 sm:py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-blue-300/25 blur-3xl dark:bg-indigo-500/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 right-20 h-52 w-52 rounded-full bg-indigo-300/20 blur-3xl dark:bg-blue-500/10"
      />
      <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-3 py-1.5 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur dark:border-blue-800 dark:bg-slate-900/60 dark:text-blue-300">
            <CheckCircle2 size={16} aria-hidden="true" />
            Interview completed
          </div>

          <h1 className="mt-5 break-words text-2xl font-bold tracking-tight sm:text-4xl">
            Great work finishing your interview
          </h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
            Here is your personalized performance report.
          </p>

          <div className="mt-6 flex flex-wrap gap-2 text-sm font-medium">
            <span className="max-w-full break-words rounded-full border border-blue-200/80 bg-white/70 px-3 py-1.5 text-slate-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200">
              {role}
            </span>
            <span className="rounded-full border border-blue-200/80 bg-white/70 px-3 py-1.5 text-slate-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 capitalize">
              {interviewType}
            </span>
            <span className="rounded-full border border-blue-200/80 bg-white/70 px-3 py-1.5 text-slate-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200">
              {difficulty}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-blue-200/80 bg-white/70 p-5 shadow-sm backdrop-blur-sm dark:border-blue-800/60 dark:bg-slate-900/70">
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Overall score
            </p>
            <p className="mt-1 text-4xl font-bold text-slate-950 dark:text-white">
              {overallScore}
              <span className="text-xl text-slate-500 dark:text-slate-300">/10</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
