import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

export default function FinalCTA() {
  const { status } = useAuth();
  const startPath =
    status === "authenticated" ? "/create-interview" : "/login";

  return (
    <section className="px-5 py-24 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-slate-950 px-6 py-20 text-center text-white shadow-2xl sm:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,.28),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(99,102,241,.22),transparent_35%)]" />
        <div className="relative mx-auto max-w-3xl">
          <Sparkles className="mx-auto text-blue-400" size={28} />
          <h2 className="mt-6 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Turn every practice session into sharper answers, clearer communication, and greater confidence.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to={startPath}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-6 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-blue-400"
            >
              Start Free Interview <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-semibold transition hover:bg-white/10"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
