import {
  BarChart3,
  BrainCircuit,
  ChartNoAxesCombined,
  Gauge,
  History,
  MessagesSquare,
  Mic2,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

const features = [
  ["AI Interview Generation", "Create focused interviews for your role, experience, and goals.", BrainCircuit],
  ["Realistic Technical Questions", "Practice questions that mirror real technical conversations.", Sparkles],
  ["Behavioral Interviews", "Build concise, structured answers for experience-based questions.", MessagesSquare],
  ["Voice-Based Practice", "Answer naturally and improve how you communicate under pressure.", Mic2],
  ["Instant AI Feedback", "Understand what worked and what to strengthen after every answer.", Gauge],
  ["Performance Scores", "Turn each practice session into clear, actionable benchmarks.", BarChart3],
  ["Progress Tracking", "See your consistency and performance evolve over time.", ChartNoAxesCombined],
  ["Interview History", "Revisit completed sessions and learn from previous feedback.", History],
  ["Role-Specific Practice", "Tailor preparation by role, technology, domain, and difficulty.", SlidersHorizontal],
] as const;

export default function FeaturesSection() {
  return (
    <section id="features" className="relative scroll-mt-20 overflow-hidden bg-white py-24 dark:bg-[#050816] sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute right-0 top-20 h-96 w-96 rounded-full bg-indigo-200/25 blur-3xl dark:bg-indigo-600/10" />
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="relative max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Everything you need</p>
          <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-slate-950 dark:text-white sm:text-5xl">
            One focused workspace for better interviews
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
            From your first practice question to long-term progress, every tool is designed to make preparation more useful.
          </p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map(([title, description, Icon], index) => (
            <article
              key={title}
              className={`group relative overflow-hidden rounded-3xl border p-8 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-950/10 ${
                index === 0 ? "border-blue-500/40 bg-gradient-to-br from-blue-600 to-indigo-700 text-white md:col-span-2 lg:col-span-1 dark:from-blue-950 dark:to-indigo-950" : "border-slate-200/80 bg-white/80 text-slate-950 hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900/65 dark:text-white dark:hover:border-blue-800"
              }`}
            >
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-50/0 to-indigo-100/0 transition duration-300 group-hover:from-blue-50/60 group-hover:to-indigo-100/40 dark:group-hover:from-blue-950/20 dark:group-hover:to-indigo-950/20" />
              <span className={`grid h-12 w-12 place-items-center rounded-2xl ${
                index === 0 ? "relative bg-white/15 text-white ring-1 ring-white/20" : "relative bg-blue-50 text-blue-600 dark:bg-blue-950/70 dark:text-blue-300"
              }`}>
                <Icon size={23} aria-hidden="true" />
              </span>
              <h3 className="relative mt-6 text-xl font-bold">{title}</h3>
              <p className={`relative mt-3 leading-7 ${index === 0 ? "text-blue-100" : "text-slate-600 dark:text-slate-300"}`}>
                {description}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-5 rounded-3xl border border-blue-200/70 bg-gradient-to-r from-blue-50 to-indigo-50 p-7 shadow-sm dark:border-blue-900/70 dark:from-blue-950/50 dark:to-indigo-950/50 md:flex md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-bold">Difficulty that grows with you</h3>
            <p className="mt-2 text-slate-600 dark:text-slate-300">Move from foundational practice to more demanding interview scenarios.</p>
          </div>
          <div className="mt-5 flex gap-2 md:mt-0">
            {["Easy", "Medium", "Hard"].map((level, index) => (
              <span key={level} className={`rounded-full px-4 py-2 text-sm font-semibold ${
                index === 1 ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "border border-blue-100 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              }`}>{level}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
