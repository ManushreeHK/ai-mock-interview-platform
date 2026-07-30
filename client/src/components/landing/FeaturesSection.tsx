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
    <section id="features" className="scroll-mt-20 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Everything you need</p>
          <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
            One focused workspace for better interviews
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            From your first practice question to long-term progress, every tool is designed to make preparation more useful.
          </p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map(([title, description, Icon], index) => (
            <article
              key={title}
              className={`group rounded-3xl border border-slate-200 p-7 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/5 ${
                index === 0 ? "bg-slate-950 text-white md:col-span-2 lg:col-span-1" : "bg-white"
              }`}
            >
              <span className={`grid h-12 w-12 place-items-center rounded-2xl ${
                index === 0 ? "bg-blue-500 text-white" : "bg-blue-50 text-blue-600"
              }`}>
                <Icon size={23} />
              </span>
              <h3 className="mt-6 text-xl font-bold">{title}</h3>
              <p className={`mt-3 leading-7 ${index === 0 ? "text-slate-300" : "text-slate-600"}`}>
                {description}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-5 rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-7 md:flex md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-bold">Difficulty that grows with you</h3>
            <p className="mt-2 text-slate-600">Move from foundational practice to more demanding interview scenarios.</p>
          </div>
          <div className="mt-5 flex gap-2 md:mt-0">
            {["Easy", "Medium", "Hard"].map((level, index) => (
              <span key={level} className={`rounded-full px-4 py-2 text-sm font-semibold ${
                index === 1 ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "border border-blue-100 bg-white text-slate-600"
              }`}>{level}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
