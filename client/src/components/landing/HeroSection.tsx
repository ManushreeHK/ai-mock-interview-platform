import { ArrowRight, CheckCircle2, PlayCircle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import HeroPreview from "./HeroPreview";

const trustPoints = [
  "AI Generated Questions",
  "Personalized Feedback",
  "Voice Practice",
  "Progress Tracking",
];

export default function HeroSection() {
  const { status } = useAuth();
  const startPath =
    status === "authenticated" ? "/create-interview" : "/login";

  return (
    <section id="about" className="relative isolate overflow-hidden bg-white dark:bg-[#050816]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(59,130,246,.16),transparent_28%),radial-gradient(circle_at_78%_20%,rgba(99,102,241,.16),transparent_30%),linear-gradient(to_bottom,rgba(239,246,255,.8),transparent_62%)] dark:bg-[radial-gradient(circle_at_14%_18%,rgba(37,99,235,.20),transparent_30%),radial-gradient(circle_at_82%_24%,rgba(79,70,229,.22),transparent_32%),linear-gradient(to_bottom,#050816,rgba(8,15,38,.96))]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.055] bg-[linear-gradient(to_right,#2563eb_1px,transparent_1px),linear-gradient(to_bottom,#2563eb_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_72%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-36 h-80 w-80 rounded-full bg-blue-300/25 blur-3xl dark:bg-blue-600/10" />
      <div className="relative mx-auto grid min-h-[calc(100vh-4.5rem)] max-w-7xl items-center gap-16 px-5 py-24 sm:px-6 lg:grid-cols-[1fr_.95fr] lg:px-8 lg:py-28">
        <div className="motion-safe:animate-[fade-up_.7s_ease-out_both]">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/70 px-3 py-1.5 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur-xl dark:border-blue-800/70 dark:bg-blue-950/40 dark:text-blue-300">
            <Sparkles size={15} aria-hidden="true" />
            AI-powered interview preparation
          </div>
          <h1 className="mt-8 max-w-3xl text-5xl font-bold leading-[1.02] tracking-[-0.045em] text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
            Practice smarter.
            <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
              Interview with confidence.
            </span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300 sm:text-xl">
            Run realistic AI mock interviews, answer by voice, and turn personalized feedback into measurable progress—across technical and behavioral interviews.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              to={startPath}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 font-semibold text-white shadow-xl shadow-blue-600/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-blue-600/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#050816]"
            >
              Start Free Interview <ArrowRight size={18} />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200/80 bg-white/65 px-6 py-3.5 font-semibold text-slate-800 shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-white/5 dark:text-slate-100 dark:hover:border-blue-700 dark:hover:bg-white/10"
            >
              <PlayCircle size={18} /> View Features
            </a>
          </div>
          <div className="mt-8 flex max-w-2xl flex-wrap gap-x-6 gap-y-3">
            {trustPoints.map((point) => (
              <span key={point} className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400">
                <CheckCircle2 size={16} className="text-emerald-500" aria-hidden="true" />
                {point}
              </span>
            ))}
          </div>
        </div>
        <HeroPreview />
      </div>
    </section>
  );
}
