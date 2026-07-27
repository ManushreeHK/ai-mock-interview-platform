import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "../ui";

export default function WelcomeBanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-10 text-white shadow-xl">
      {/* Background Glow */}
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-cyan-400/20 blur-2xl" />

      <div className="relative flex items-center justify-between">
        {/* Left */}
        <div className="max-w-xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm backdrop-blur">
            <Sparkles size={16} />
            AI Powered Mock Interviews
          </div>

          <h1 className="text-5xl font-bold leading-tight">
            Welcome back 👋
          </h1>

          <p className="mt-4 text-lg text-blue-100">
            Ready to level up your interview skills today?
            Practice technical, behavioral, and coding interviews
            powered by AI.
          </p>

          <div className="mt-8 flex gap-4">
           <Button
  variant="hero"
  size="lg"
>
  Start AI Interview
</Button>

            <Button
              variant="ghost"
              size="lg"
              className="border border-white/30 text-white hover:bg-white/10"
            >
              View History
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>

        {/* Right */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="flex h-72 w-72 items-center justify-center rounded-full bg-white/10 backdrop-blur">
            <div className="text-center">
              <div className="text-7xl">🤖</div>

              <p className="mt-4 text-xl font-semibold">
                AI Interview Coach
              </p>

              <p className="text-blue-100">
                Personalized feedback
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}