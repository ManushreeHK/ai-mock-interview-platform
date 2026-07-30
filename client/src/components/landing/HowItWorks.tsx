import { BarChart3, Mic2, SlidersHorizontal } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Shape your interview",
    description: "Choose your role, experience level, and difficulty to create a session that meets you where you are.",
    details: ["Choose role", "Set experience", "Select difficulty"],
    icon: SlidersHorizontal,
  },
  {
    number: "02",
    title: "Practice naturally",
    description: "Work through AI-generated questions and answer using voice for a realistic interview rhythm.",
    details: ["AI-generated questions", "Voice answers", "Focused practice"],
    icon: Mic2,
  },
  {
    number: "03",
    title: "Turn feedback into progress",
    description: "Review detailed feedback, strengths, improvement areas, and practical tips for your next attempt.",
    details: ["Strengths", "Areas to improve", "Actionable tips"],
    icon: BarChart3,
  },
] as const;

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-slate-950 py-24 text-white sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">How it works</p>
          <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
            From setup to insight in three simple steps
          </h2>
        </div>
        <div className="relative mt-16 grid gap-6 lg:grid-cols-3">
          <div className="absolute left-[16%] right-[16%] top-8 hidden h-px bg-gradient-to-r from-blue-500/20 via-blue-400 to-blue-500/20 lg:block" />
          {steps.map(({ number, title, description, details, icon: Icon }) => (
            <article key={number} className="relative rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur transition hover:-translate-y-1 hover:border-blue-400/40">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold tracking-widest text-blue-400">STEP {number}</span>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-500 text-white shadow-lg shadow-blue-500/20">
                  <Icon size={22} />
                </span>
              </div>
              <h3 className="mt-8 text-2xl font-bold">{title}</h3>
              <p className="mt-4 leading-7 text-slate-400">{description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {details.map((detail) => (
                  <span key={detail} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300">
                    {detail}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
