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
    <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 px-6 py-10 text-white shadow-lg sm:px-10">
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold ring-1 ring-white/20">
            <CheckCircle2 size={16} />
            Interview completed
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
            Great work finishing your interview
          </h1>
          <p className="mt-3 text-lg text-blue-100">
            Here is your personalized performance report.
          </p>

          <div className="mt-6 flex flex-wrap gap-2 text-sm font-medium">
            <span className="rounded-full bg-white/10 px-3 py-1.5">
              {role}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1.5 capitalize">
              {interviewType}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1.5">
              {difficulty}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-4 rounded-2xl bg-white/10 p-5 ring-1 ring-white/20 backdrop-blur-sm">
          <div>
            <p className="text-sm font-medium text-blue-100">
              Overall score
            </p>
            <p className="mt-1 text-4xl font-bold">
              {overallScore}
              <span className="text-xl text-blue-100">/10</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
