import { ArrowRight, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import type { InterviewHistoryItem } from "../../types/interview-history";
import { formatHistoryDate } from "../../utils/interviewHistoryView";

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div aria-label={`${label}: ${value} out of 10`}>
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="text-slate-500">{label}</span>
        <span className="font-semibold text-slate-800">{value}/10</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-600"
          style={{ width: `${value * 10}%` }}
        />
      </div>
    </div>
  );
}

export default function HistoryCard({
  interview,
}: {
  interview: InterviewHistoryItem;
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md sm:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold capitalize text-emerald-700">
              {interview.status}
            </span>
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium capitalize text-blue-700">
              {interview.interviewType}
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              {interview.difficulty}
            </span>
          </div>
          <h2 className="mt-3 break-words text-xl font-bold text-slate-900 dark:text-slate-100">
            {interview.role}
          </h2>
          <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            Completed {formatHistoryDate(interview.createdAt)}
          </p>
        </div>

        <div className="grid flex-[1.5] gap-4 sm:grid-cols-3">
          <Score label="Communication" value={interview.communication} />
          <Score label="Technical" value={interview.technicalKnowledge} />
          <Score label="Confidence" value={interview.confidence} />
        </div>

        <div className="flex flex-col items-stretch gap-4 border-t border-slate-100 pt-4 dark:border-slate-700 min-[390px]:flex-row min-[390px]:items-center min-[390px]:justify-between xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Overall
            </p>
            <p
              className="mt-1 text-3xl font-bold text-blue-600"
              aria-label={`Overall score: ${interview.overallScore} out of 10`}
            >
              {interview.overallScore}
              <span className="text-base text-slate-400">/10</span>
            </p>
          </div>
          <Link
            to={`/history/${encodeURIComponent(interview.interviewId)}`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            aria-label={`View results for ${interview.role} completed ${formatHistoryDate(interview.createdAt)}`}
          >
            View Results
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
