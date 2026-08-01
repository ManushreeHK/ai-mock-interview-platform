const companies = ["Google", "Amazon", "Microsoft", "Meta", "Stripe"];

const stats = [
  ["10k+", "Interviews Completed"],
  ["95%", "User Satisfaction"],
  ["4.9★", "Average Rating"],
  ["AI Powered", "Voice + Feedback"],
] as const;

export default function TrustedFor() {
  return (
    <section aria-labelledby="trusted-title" className="border-y border-slate-200/70 bg-white/70 py-16 dark:border-slate-800 dark:bg-[#070b18]">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 id="trusted-title" className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Trusted by developers preparing for
          </h2>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-10 gap-y-5 sm:gap-x-14">
            {companies.map((company) => (
              <span key={company} className="text-lg font-bold tracking-tight text-slate-400 grayscale transition hover:text-slate-700 dark:text-slate-600 dark:hover:text-slate-300">
                {company}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map(([value, label]) => (
            <div key={label} className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 text-center shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60">
              <p className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">{value}</p>
              <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
