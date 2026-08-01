import { BarChart3, Check, Code2, MessageSquareText, Mic, Sparkles } from "lucide-react";

export default function HeroPreview() {
  return (
    <div className="relative mx-auto w-full max-w-xl motion-safe:animate-[fade-up_.8s_.15s_ease-out_both] lg:mx-0">
      <div aria-hidden="true" className="absolute -inset-12 -z-10 rounded-full bg-gradient-to-br from-blue-300/40 to-indigo-300/30 blur-3xl dark:from-blue-600/15 dark:to-indigo-600/15" />
      <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/70 p-2.5 shadow-[0_32px_100px_-30px_rgba(30,64,175,.38)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/65 dark:shadow-[0_32px_100px_-30px_rgba(37,99,235,.28)]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-950">
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-blue-600 text-white">
                <Sparkles size={14} />
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">InterviewAce AI</span>
            </div>
            <div className="flex gap-1.5">
              <span className="h-2 w-2 rounded-full bg-slate-200" />
              <span className="h-2 w-2 rounded-full bg-slate-200" />
              <span className="h-2 w-2 rounded-full bg-slate-200" />
            </div>
          </div>

          <div className="grid gap-3 p-4 sm:grid-cols-[1.25fr_.75fr]">
            <div className="rounded-2xl bg-slate-950 p-5 text-white">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-blue-500/20 px-2.5 py-1 text-[10px] font-semibold text-blue-200">
                  Technical · Medium
                </span>
                <span className="text-[10px] text-slate-400">Question 3 of 5</span>
              </div>
              <p className="mt-7 text-sm font-semibold leading-6">
                How would you optimize rendering performance in a complex React application?
              </p>
              <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="mb-2 flex items-center gap-2 text-[10px] text-slate-400">
                  <Mic size={12} className="text-blue-400" />
                  Voice answer
                </div>
                <div className="space-y-1.5">
                  <div className="h-1.5 w-full rounded-full bg-white/15" />
                  <div className="h-1.5 w-4/5 rounded-full bg-white/10" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-500">Overall score</span>
                  <BarChart3 size={14} className="text-blue-600" />
                </div>
                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">8.4<span className="text-xs text-slate-400">/10</span></p>
                <div className="mt-3 h-1.5 rounded-full bg-slate-100">
                  <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" />
                </div>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 dark:border-emerald-800/60 dark:bg-emerald-950/35">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                  <Check size={14} /> Strong answer
                </div>
                <p className="mt-2 text-[10px] leading-4 text-emerald-800/70">
                  Clear structure and relevant technical examples.
                </p>
              </div>
            </div>
          </div>

          <div className="mx-4 mb-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-100 text-violet-600">
              <Code2 size={16} />
            </span>
            <div className="flex-1">
              <div className="flex justify-between text-[10px] font-semibold">
                <span>Weekly progress</span><span className="text-blue-600">Improving</span>
              </div>
              <div className="mt-2 flex h-7 items-end gap-1">
                {[35, 52, 44, 66, 60, 78, 88].map((height, index) => (
                  <span key={index} className="flex-1 rounded-sm bg-blue-500/80" style={{ height: `${height}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute -right-4 top-12 hidden items-center gap-2 rounded-xl border border-white/80 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-700 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-200 sm:flex lg:-right-8">
        <MessageSquareText size={15} className="text-emerald-500" /> AI Feedback ready
      </div>
      <div aria-hidden="true" className="absolute -bottom-5 -left-3 hidden items-center gap-2 rounded-xl border border-white/80 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-700 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-200 sm:flex lg:-left-8">
        <Mic size={15} className="text-blue-500" /> Voice answer captured
      </div>
    </div>
  );
}
