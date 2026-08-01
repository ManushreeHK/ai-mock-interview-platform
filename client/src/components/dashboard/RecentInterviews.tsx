import { History } from "lucide-react";
import { Link } from "react-router-dom";
import InterviewCard from "./InterviewCard";
import type { InterviewHistoryItem } from "../../types/interview-history";

function formatDate(createdAt: string) {
  return new Date(createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function RecentInterviews({ interviews }: { interviews: InterviewHistoryItem[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900" aria-labelledby="recent-interviews-title">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="recent-interviews-title" className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-slate-100"><History className="h-5 w-5 text-blue-600 dark:text-blue-300" aria-hidden="true" />Recent Interviews</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Your latest completed sessions</p>
        </div>
        <Link to="/history" className="shrink-0 rounded-lg px-2 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-300 dark:hover:bg-blue-950">View All</Link>
      </div>
      {interviews.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center text-center">
          <History className="h-9 w-9 text-slate-300 dark:text-slate-600" aria-hidden="true" />
          <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">Complete your first interview to see progress here.</p>
          <Link to="/create-interview" className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">Start Interview</Link>
        </div>
      ) : (
        <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
          {interviews.slice(0, 4).map((interview) => (
            <InterviewCard key={interview.interviewId} interviewId={interview.interviewId} role={interview.role} type={interview.interviewType} score={interview.overallScore} date={formatDate(interview.createdAt)} difficulty={interview.difficulty} />
          ))}
        </div>
      )}
      {interviews.length > 0 ? <Link to="/history" className="mt-3 flex min-h-10 items-center justify-center rounded-xl text-sm font-semibold text-blue-600 transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-300 dark:hover:bg-blue-950">View all interviews</Link> : null}
    </section>
  );
}
