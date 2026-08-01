import { useState } from "react";
import { Bug, ChevronDown, FileText, Mail, Scale } from "lucide-react";
import AccountSection from "../../components/account/AccountSection";
import { faqItems, toggleFaq } from "../../utils/help";

const troubleshooting = [
  ["Microphone permission", "Allow the microphone for this exact domain and use a browser that supports the Web Speech API."],
  ["Google login redirect", "If sign-in stops at Cognito, return to the original application URL and try again. Redirect URLs must match exactly."],
  ["AI service busy", "Wait briefly and retry. High provider demand can exceed the bounded retry window."],
  ["Quota exceeded", "Daily AI quota cannot be fixed by repeated requests. Try again after quota becomes available."],
  ["History temporarily unavailable", "Use Try Again without refreshing. Existing saved interviews are not removed by a read failure."],
] as const;

const supportActions = [
  [Bug, "Report a Bug"],
  [Mail, "Contact Support"],
  [FileText, "Privacy Policy"],
  [Scale, "Terms of Service"],
] as const;

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header><h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Help &amp; Support</h1><p className="mt-2 text-slate-600 dark:text-slate-400">Answers and practical troubleshooting for InterviewAce AI.</p></header>

      <AccountSection title="Frequently asked questions">
        <div className="divide-y divide-slate-200 dark:divide-slate-700">{faqItems.map((item) => { const open = openFaq === item.id; return <div key={item.id} className="py-2"><h3><button type="button" aria-expanded={open} aria-controls={`faq-${item.id}`} onClick={() => setOpenFaq((current) => toggleFaq(current, item.id))} className="flex min-h-12 w-full items-center justify-between gap-4 rounded-xl px-3 text-left font-semibold text-slate-900 outline-none hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-100 dark:hover:bg-slate-800">{item.question}<ChevronDown className={`h-5 w-5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} /></button></h3><div id={`faq-${item.id}`} hidden={!open} className="px-3 pb-4 pt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.answer}</div></div>; })}</div>
      </AccountSection>

      <AccountSection title="Troubleshooting"><div className="grid gap-4 sm:grid-cols-2">{troubleshooting.map(([title, answer]) => <article key={title} className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800"><h3 className="font-semibold text-slate-900 dark:text-slate-100">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{answer}</p></article>)}</div></AccountSection>

      <AccountSection title="Support and legal" description="No public support email or legal routes are configured yet."><div className="grid gap-3 sm:grid-cols-2">{supportActions.map(([Icon, label]) => <button key={label} type="button" disabled className="flex min-h-12 cursor-not-allowed items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 text-left font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800"><Icon className="h-5 w-5" />{label}<span className="ml-auto text-xs">Coming Soon</span></button>)}</div></AccountSection>

      <p className="text-center text-sm text-slate-400">InterviewAce AI · v{__APP_VERSION__}</p>
    </div>
  );
}
