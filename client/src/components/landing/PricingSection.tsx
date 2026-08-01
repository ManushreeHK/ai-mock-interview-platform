import { Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Start building your interview rhythm.",
    features: ["Limited interviews each month", "Basic AI feedback", "Interview history", "Progress tracking", "Standard interview generation"],
    action: "Start Free",
    to: "/signup",
  },
  {
    name: "Pro",
    price: "Coming Soon",
    description: "Go deeper with more practice and insight.",
    features: ["More interviews", "Advanced AI feedback", "Detailed analytics", "Priority generation", "More interview types", "Company-specific interview packs"],
    action: "Coming Soon",
    featured: true,
  },
  {
    name: "Premium",
    price: "Coming Soon",
    description: "The complete preparation experience.",
    features: ["Unlimited interviews", "Premium AI analysis", "Resume-based interviews", "Advanced reporting", "Future premium features", "Priority support"],
    action: "Join Waitlist",
    to: "/signup",
  },
] as const;

export default function PricingSection() {
  return (
    <section id="pricing" className="scroll-mt-20 bg-white py-24 dark:bg-[#050816] sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Simple pricing</p>
          <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">Start free. Grow when you’re ready.</h2>
          <p className="mt-5 text-lg text-slate-600 dark:text-slate-300">No payment setup is required to begin practicing.</p>
        </div>
        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex flex-col rounded-3xl border p-7 transition hover:-translate-y-1 ${
                "featured" in plan && plan.featured
                  ? "border-blue-500/70 bg-gradient-to-br from-slate-950 to-blue-950 text-white shadow-2xl shadow-blue-950/20 lg:-translate-y-3 lg:hover:-translate-y-4"
                  : "border-slate-200 bg-white shadow-sm hover:border-blue-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/65 dark:hover:border-blue-800"
              }`}
            >
              {"featured" in plan && plan.featured && (
                <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-blue-500 px-3 py-1 text-xs font-bold text-white">
                  <Sparkles size={12} /> Most Popular
                </span>
              )}
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className={`mt-3 text-sm ${"featured" in plan && plan.featured ? "text-slate-400" : "text-slate-500 dark:text-slate-400"}`}>
                {plan.description}
              </p>
              <p className="mt-7 text-4xl font-bold tracking-tight">{plan.price}</p>
              <div className={`my-7 h-px ${"featured" in plan && plan.featured ? "bg-white/10" : "bg-slate-100"}`} />
              <ul className="flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className={`flex gap-3 text-sm ${"featured" in plan && plan.featured ? "text-slate-300" : "text-slate-600 dark:text-slate-300"}`}>
                    <Check size={17} className="mt-0.5 shrink-0 text-emerald-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              {"to" in plan ? (
                <Link to={plan.to} className="mt-8 rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-blue-700">
                  {plan.action}
                </Link>
              ) : (
                <button disabled className="mt-8 cursor-not-allowed rounded-xl border border-white/15 bg-white/10 px-5 py-3 font-semibold text-slate-300">
                  {plan.action}
                </button>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
