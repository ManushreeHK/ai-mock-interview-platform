import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useCurrentUser } from "../../hooks/useCurrentUser";

export default function WelcomeBanner() {
  const user = useCurrentUser();
  const firstName = user.displayName.trim().split(/\s+/)[0] || "there";

  return (
    <section className="relative min-h-64 overflow-hidden rounded-3xl border border-blue-200/80 bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 p-7 shadow-sm dark:border-blue-900/70 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 sm:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-blue-300/25 blur-3xl dark:bg-indigo-500/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 right-20 h-52 w-52 rounded-full bg-indigo-300/20 blur-3xl dark:bg-blue-500/10"
      />
      <div className="relative z-10 max-w-xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-sm backdrop-blur dark:border-blue-800 dark:bg-slate-900/60 dark:text-blue-300">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          AI Powered Mock Interviews
        </div>
        <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
          Welcome back,<br />{firstName}
        </h1>
        <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
          Practice realistic AI-powered technical interviews and improve with personalized feedback.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/create-interview" className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-blue-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-slate-900 sm:w-auto">
            Start AI Interview
          </Link>
          <Link to="/history" className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white/80 px-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-400 hover:bg-white hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-600 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:border-blue-500 dark:hover:bg-slate-900 dark:hover:text-blue-300 sm:w-auto">
            View History <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
