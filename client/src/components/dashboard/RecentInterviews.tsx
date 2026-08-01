import InterviewCard from "./InterviewCard";
import type { InterviewHistoryItem } from "../../types/interview-history";
import { Link } from "react-router-dom";

function formatDate(createdAt: string) {
  return new Date(createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getStatus(score: number) {
  if (score >= 9) return "Excellent" as const;
  if (score >= 7) return "Good" as const;
  return "Fair" as const;
}

export default function RecentInterviews({
  interviews,
}: {
  interviews: InterviewHistoryItem[];
}) {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Recent Interviews
          </h2>
          <p className="text-sm text-slate-500">
            Your latest AI interview sessions
          </p>
        </div>
        <Link
          to="/history"
          className="rounded-lg px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          View All
        </Link>
      </div>

      {interviews.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
          Complete your first interview to see progress here.
        </div>
      ) : (
        <div className="space-y-5">
          {interviews.slice(0, 5).map((interview) => (
            <InterviewCard
              key={interview.interviewId}
              role={interview.role}
              type={interview.interviewType}
              score={interview.overallScore}
              status={getStatus(interview.overallScore)}
              date={formatDate(interview.createdAt)}
              difficulty={interview.difficulty}
            />
          ))}
        </div>
      )}
    </section>
  );
}
