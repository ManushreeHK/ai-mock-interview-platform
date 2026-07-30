import {
  CalendarClock,
  ChartNoAxesCombined,
  Clock3,
  MessagesSquare,
  ShieldCheck,
  Zap,
} from "lucide-react";

const benefits = [
  ["Reduce interview anxiety", "Build familiarity through realistic, repeatable practice.", ShieldCheck],
  ["Practice anytime", "Prepare when it suits you, without coordinating schedules.", CalendarClock],
  ["Improve communication", "Learn to explain your thinking with clarity and structure.", MessagesSquare],
  ["Track growth", "Use scores and history to see where your preparation is working.", ChartNoAxesCombined],
  ["Boost confidence", "Replace uncertainty with focused preparation and useful feedback.", Zap],
  ["Prepare faster", "Spend less time guessing what to practice and more time improving.", Clock3],
] as const;

export default function BenefitsSection() {
  return (
    <section className="bg-slate-50 py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:px-8">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Why InterviewAce AI</p>
          <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
            Preparation that feels purposeful
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Build practical interview skills with a workflow designed for consistency, clarity, and confidence.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {benefits.map(([title, description, Icon]) => (
            <article key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <Icon className="text-blue-600" size={24} />
              <h3 className="mt-5 text-lg font-bold">{title}</h3>
              <p className="mt-2 leading-7 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
