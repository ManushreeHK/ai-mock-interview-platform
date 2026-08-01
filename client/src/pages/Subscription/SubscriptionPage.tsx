import { Check, Crown } from "lucide-react";
import { useInterviewMetrics } from "../../hooks/useInterviewMetrics";

const plans = [
  {
    name: "Free",
    price: "$0",
    status: "Current plan",
    features: ["AI mock interviews", "Structured feedback", "Progress dashboard"],
  },
  {
    name: "Pro",
    price: "—",
    status: "Coming Soon",
    features: ["Additional practice options", "Expanded insights", "Future premium tools"],
  },
  {
    name: "Premium",
    price: "—",
    status: "Coming Soon",
    features: ["Advanced reporting", "Future coaching tools", "Priority features"],
  },
];

export default function SubscriptionPage() {
  const { metrics, isLoading, error } = useInterviewMetrics();

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
          Free plan
        </span>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          Subscription
        </h1>
        <p className="mt-2 text-slate-600">
          Review your current plan. Paid billing is not available yet.
        </p>
      </div>

      <section className="flex flex-col justify-between gap-4 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-lg sm:flex-row sm:items-center sm:p-8">
        <div>
          <div className="flex items-center gap-2">
            <Crown className="h-6 w-6" aria-hidden="true" />
            <h2 className="text-xl font-bold">Current plan: Free</h2>
          </div>
          <p className="mt-2 text-blue-100">
            {error
              ? "Usage is temporarily unavailable."
              : isLoading
                ? "Loading your usage…"
                : `${metrics?.totalInterviews ?? 0} completed interviews · ${metrics?.averageScore ?? 0}/10 average score`}
          </p>
        </div>
        <span className="w-fit rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
          No payment required
        </span>
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <section
            key={plan.name}
            className={`rounded-3xl border bg-white p-6 shadow-sm ${
              plan.name === "Free" ? "border-blue-300" : "border-slate-200"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {plan.name}
                </h2>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {plan.price}
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {plan.status}
              </span>
            </div>
            <ul className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-2 text-sm text-slate-600">
                  <Check className="h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
            {plan.name !== "Free" && (
              <button
                type="button"
                disabled
                className="mt-6 min-h-11 w-full rounded-xl bg-slate-100 font-semibold text-slate-500 disabled:cursor-not-allowed"
              >
                Coming Soon
              </button>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
