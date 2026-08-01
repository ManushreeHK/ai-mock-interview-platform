import { Calendar, Gauge } from "lucide-react";
import { Link } from "react-router-dom";

type InterviewCardProps = { interviewId: string; role: string; type: string; score: number; date: string; difficulty: string };

export default function InterviewCard({ interviewId, role, type, score, date, difficulty }: InterviewCardProps) {
  return (
    <article className="py-4 first:pt-2 last:pb-2">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold capitalize text-blue-700 dark:bg-blue-950 dark:text-blue-300">{type}</span>
          <h3 className="mt-2 break-words text-sm font-semibold text-slate-900 dark:text-slate-100">{role}</h3>
          <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" aria-hidden="true" />{date}</span>
            <span className="flex items-center gap-1"><Gauge className="h-3.5 w-3.5" aria-hidden="true" />{difficulty}</span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{score.toFixed(1)}<span className="text-xs font-medium text-slate-400">/10</span></p>
          <div className="mt-1 h-1.5 w-16 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800" aria-hidden="true"><div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.min(100, score * 10)}%` }} /></div>
          <Link to={`/history/${encodeURIComponent(interviewId)}`} className="mt-2 inline-flex text-xs font-semibold text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-300">View Results</Link>
        </div>
      </div>
    </article>
  );
}
