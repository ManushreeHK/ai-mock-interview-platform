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
    <section id="about" className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,.12),transparent_25%),radial-gradient(circle_at_85%_30%,rgba(99,102,241,.10),transparent_25%)]" />
      <div className="relative mx-auto grid min-h-[calc(100vh-4.5rem)] max-w-7xl items-center gap-16 px-5 py-20 sm:px-6 lg:grid-cols-[1fr_.95fr] lg:px-8 lg:py-24">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3 py-1.5 text-sm font-semibold text-blue-700 shadow-sm">
            <Sparkles size={15} />
            AI-powered interview preparation
          </div>
          <h1 className="mt-7 max-w-3xl text-5xl font-bold leading-[1.05] tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-7xl">
            Practice smarter.
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Interview with confidence.
            </span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
            Run realistic AI mock interviews, answer by voice, and turn personalized feedback into measurable progress—across technical and behavioral interviews.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              to={startPath}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Start Free Interview <ArrowRight size={18} />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300"
            >
              <PlayCircle size={18} /> View Features
            </a>
          </div>
          <div className="mt-8 flex max-w-2xl flex-wrap gap-x-6 gap-y-3">
            {trustPoints.map((point) => (
              <span key={point} className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                <CheckCircle2 size={16} className="text-emerald-500" />
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
