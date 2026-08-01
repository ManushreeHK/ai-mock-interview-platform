import { Check, Crown, Sparkles } from "lucide-react";
import AccountSection from "../../components/account/AccountSection";
import { useInterviewMetrics } from "../../hooks/useInterviewMetrics";
import {
  countInterviewsThisMonth,
  subscriptionPlans,
} from "../../utils/account";

export default function SubscriptionPage() {
  const { metrics, history, isLoading, error } = useInterviewMetrics();
  const thisMonth = countInterviewsThisMonth(history.map((item) => item.createdAt));

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header><h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Subscription</h1><p className="mt-2 text-slate-600 dark:text-slate-400">InterviewAce AI is currently free while the platform is in beta.</p></header>

      <section className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><div className="flex items-center gap-2"><Crown className="h-6 w-6" /><h2 className="text-2xl font-bold">Free plan</h2></div><p className="mt-2 text-blue-100">Unlimited during beta. No hard monthly usage limit is currently enforced.</p></div><span className="w-fit rounded-full bg-white/15 px-4 py-2 font-semibold">Current Plan</span></div>
      </section>

      <AccountSection title="Usage" description="Calculated from your completed interview history.">
        {error ? <p className="rounded-xl bg-amber-50 p-4 text-amber-800">Usage is temporarily unavailable.</p> : <div className="grid gap-4 sm:grid-cols-2"><div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800"><p className="text-sm text-slate-500">Interviews completed</p><p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">{isLoading ? "—" : metrics?.totalInterviews ?? 0}</p></div><div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800"><p className="text-sm text-slate-500">Completed this month</p><p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">{isLoading ? "—" : thisMonth}</p></div></div>}
      </AccountSection>

      <div className="grid gap-5 lg:grid-cols-3">{subscriptionPlans.map((plan) => <section key={plan.name} className={`rounded-3xl border bg-white p-6 shadow-sm dark:bg-slate-900 ${plan.name === "Free" ? "border-blue-400" : "border-slate-200 dark:border-slate-700"}`}><div className="flex items-center justify-between"><h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{plan.name}</h2>{plan.name === "Free" ? <Sparkles className="h-5 w-5 text-blue-600" /> : null}</div><span className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{plan.status}</span><ul className="mt-6 space-y-3">{plan.features.map((feature) => <li key={feature} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300"><Check className="h-5 w-5 shrink-0 text-emerald-600" />{feature}</li>)}</ul><button type="button" disabled className={`mt-6 min-h-11 w-full rounded-xl font-semibold disabled:cursor-not-allowed ${plan.name === "Free" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-500 dark:bg-slate-800"}`}>{plan.status}</button></section>)}</div>

      <p className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-sm text-blue-900">Beta notice: plan names describe the current product direction only. Paid subscriptions, checkout, billing portals, and waitlists are not implemented.</p>
    </div>
  );
}
